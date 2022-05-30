import {
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";

function groupItemsBasedOnAccounts(itemsList = []) {
  let salesAccounts = [];

  itemsList.forEach((item) => {
    const { salesAccountId } = item;
    const index = salesAccounts.findIndex(
      (account) => account.accountId === salesAccountId
    );
    if (index === -1) {
      //not in list-add it
      salesAccounts.push({ accountId: salesAccountId });
    }
  });

  return salesAccounts.map(({ accountId }) => {
    const items = itemsList.filter((item) => item.salesAccountId === accountId);

    return {
      accountId,
      items,
    };
  });
}

export async function getSalesAccounts(
  selectedItems = [],
  salesAmountKey = "taxExclusiveAmount"
) {
  let salesAccounts = groupItemsBasedOnAccounts(selectedItems);

  salesAccounts = salesAccounts.map((account) => {
    const { items } = account;
    const salesAmount = items.reduce((sum, item) => {
      return sum + item[salesAmountKey];
    }, 0);

    return {
      ...account,
      salesAmount,
    };
  });

  return salesAccounts;
}

export async function getAccountData(transaction, orgId, accountId) {
  const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
  const accountDoc = await transaction.get(accountRef);

  if (!accountDoc.exists) {
    throw new Error(`Account with id ${accountId} not found!`);
  }

  const { name, accountType } = accountDoc.data();

  return {
    name,
    accountType,
    accountId,
  };
}

export async function getInvoiceData(transaction, orgId, invoiceId) {
  const invoiceRef = doc(db, "organizations", orgId, "invoices", invoiceId);
  const invoiceDoc = await transaction.get(invoiceRef);
  const invoiceData = invoiceDoc.data();

  if (!invoiceDoc.exists || invoiceData.status === "deleted") {
    throw new Error(`Invoice with id ${invoiceId} not found!`);
  }

  return {
    ...invoiceData,
    invoiceId,
  };
}

export async function getCustomerEntryData(
  orgId = "",
  customerId = "",
  accountId = "",
  transactionId = "",
  transactionType = "",
  status = "active"
) {
  // console.log({
  //   transactionType,
  //   orgId,
  //   accountId,
  //   customerId,
  //   transactionId,
  //   status,
  // });
  const q = query(
    collection(db, "organizations", orgId, "journals"),
    orderBy("createdAt", "desc"),
    where("transactionDetails.customerId", "==", customerId),
    where("transactionId", "==", transactionId),
    where("account.accountId", "==", accountId),
    where("transactionType", "==", transactionType),
    where("status", "==", status),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    // throw new Error(`Customer entry data not found! Entry data:{
    //   customerId:${customerId},
    //   transactionId:${transactionId},
    //   accountId:${accountId},
    //   TransactionType:${transactionType},
    //   status:${status}
    // }`);
    return null;
  }

  const entryDoc = snap.docs[0];
  const entryId = entryDoc.id;
  const { credit, debit } = entryDoc.data();

  return {
    credit,
    debit,
    entryId,
  };
}

export function getItemsToUpdate(items = [], incomingItems = []) {
  /**
   * traverse through items array
   * check if current item is in the incoming items array
   * if true, compute adjustment value and remove item from incoming items array
   * else value has been deleted, compute adjustment
   * check if there are any values left in the incomingItems array
   * traverse over the remaining value-all are new items
   * compute adjustment values
   *
   * remove all similar values--adjustment value is zero(0)
   * finally compute adjustment values for specific sales accounts
   *
   */

  //new array to hold all the different values
  //no duplicates
  let uniqueItems = [];

  /**
   * are the items similar.
   * traverse items and remove similar items from both arrays
   * if the remaining arrays are empty, items were similar,
   * else, the items have changed
   */
  const items1 = [...items];
  const items2 = [...incomingItems];
  const similarItems = [];
  /**
   * for similar items, don't alter taxExclusiveAmount
   * give tag="similar"
   * for new items, dont alter taxExclusiveAmount - only available in items2 array
   * give a tag="new"
   * for deleted items, assign taxExclusiveAmount=0-Only available in items1 array
   * give tag="deleted"
   */

  items1.forEach((item, i) => {
    const { itemId, taxExclusiveAmount } = item;
    const index = items2.findIndex((item2) => item2.itemId === itemId);
    let data = item;

    if (index > -1) {
      /**
       * similar item has been found
       * use splice function to remove item from items2 array.
       * the return value is an array containing the removed items.
       * assign the returned value to be item2 at index 0
       */
      const item2 = items2.splice(index, 1)[0];
      /**
       * remove salesAccount and salesAccountId from item2
       * currently, there is no support for a situation where the items sales
       * Account has changed.
       * always use the items first sales account
       * then spread data from item2 to overide since its the latest data
       */
      const { salesAccountId, salesAccount, ...rest } = item2;
      //assign values to data
      data = {
        ...data,
        ...rest,
      };
      //check if both item taxExclusive amounts are equal
      if (taxExclusiveAmount === item2.taxExclusiveAmount) {
        //push to similarItems array
        similarItems.push({
          ...data,
        });
      }
    } else {
      /**
       * still traversing items1 array.
       * if item has not been found in second array
       * it has been deleted
       * set taxExclusiveAmount and totalAmount to be zero
       * subtract from zero to make it -ve
       */
      data = {
        ...data,
        taxExclusiveAmount: 0,
        totalAmount: 0,
      };
    }
    /**
     * at the end of a cycle
     * add the newly created data to the unique items array
     */
    uniqueItems.push(data);
  });

  /**
   * check if there are items remaining in items2 array
   * this is a completely new item
   * values are new. add them to unique items array
   */
  if (items2.length > 0) {
    items2.forEach((item) => {
      uniqueItems.push(item);
    });
  }

  return { uniqueItems, similarItems };
}

export async function getItemsEntriesToUpdate(
  transaction,
  customerHasChanged,
  orgId = "",
  invoice = {
    invoiceId: "",
    customerId: "",
    invoiceSlug: "",
    selectedItems: [],
  },
  incomingItems = []
) {
  /**
   * get items to update
   *
   */
  const { customerId, invoiceSlug, selectedItems } = invoice;

  const { uniqueItems, similarItems } = getItemsToUpdate(
    selectedItems,
    incomingItems
  );
  let itemsToUpdate = customerHasChanged
    ? uniqueItems
    : uniqueItems.length === similarItems.length
    ? []
    : uniqueItems;
  // console.log({ itemsToUpdate });
  const salesAccounts = groupItemsBasedOnAccounts(itemsToUpdate);

  const entries = await Promise.all(
    salesAccounts.map(async (account) => {
      const { accountId, items } = account;
      const entryData = await getCustomerEntryData(
        orgId,
        customerId,
        accountId,
        invoiceSlug,
        "invoice"
      );

      let accountData = null;

      if (!entryData) {
        accountData = await getAccountData(transaction, orgId, accountId);
      }
      const amount = items.reduce((sum, item) => {
        return sum + item.taxExclusiveAmount;
      }, 0);

      return {
        accountData,
        entryData,
        amount,
        accountId,
      };
    })
  );

  return entries;
}

function getCustomerSummaryEntryData(
  orgId,
  customerId,
  accountId = "",
  transactionId = "",
  transactionType = "",
  shouldFetch = true
) {
  if (!shouldFetch) {
    return null;
  }

  return getCustomerEntryData(
    orgId,
    customerId,
    accountId,
    transactionId,
    transactionType
  );
}

export async function getSummaryEntries(
  customerHasChanged,
  orgId,
  invoice,
  incomingSummary = {}
) {
  const { customerId, invoiceSlug, summary } = invoice;
  const { shipping, adjustment, totalTaxes, totalAmount } = incomingSummary;

  const [shippingEntry, adjustmentEntry, taxEntry, receivableEntry] =
    await Promise.all([
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "shipping_charge",
        invoiceSlug,
        "invoice",
        customerHasChanged || shipping !== summary.shipping
      ),
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "other_charges",
        invoiceSlug,
        "invoice",
        customerHasChanged || adjustment !== summary.adjustment
      ),
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "tax_payable",
        invoiceSlug,
        "invoice",
        customerHasChanged || totalTaxes !== summary.totalTaxes
      ),
      getCustomerSummaryEntryData(
        orgId,
        customerId,
        "accounts_receivable",
        invoiceSlug,
        "invoice",
        customerHasChanged || totalAmount !== summary.totalAmount
      ),
    ]);

  return {
    shippingEntry,
    adjustmentEntry,
    taxEntry,
    receivableEntry,
  };
}
