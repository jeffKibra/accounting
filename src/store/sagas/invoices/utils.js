import { doc } from "firebase/firestore";
import { db } from "../../../utils/firebase";

export async function getSalesAccounts(transaction, orgId, selectedItems = []) {
  let salesAccounts = [];

  selectedItems.forEach((item) => {
    const { salesAccountId } = item;
    const index = salesAccounts.findIndex(
      (account) => account.accountId === salesAccountId
    );
    if (index === -1) {
      //not in list-add it
      salesAccounts.push({ accountId: salesAccountId });
    }
  });

  salesAccounts = await Promise.all(
    salesAccounts.map(async (account) => {
      const { accountId } = account;
      const accountRef = doc(db, "organizations", orgId, "accounts", accountId);
      const accountDoc = await transaction.get(accountRef);
      if (!accountDoc.exists) {
        throw new Error("Account not found!");
      }

      const { name, accountType } = accountDoc.data();

      const items = selectedItems.filter(
        (item) => item.salesAccountId === accountId
      );
      const salesAmount = items.reduce((sum, item) => {
        return sum + item.taxExclusiveAmount;
      }, 0);

      return {
        ...account,
        salesAmount,
        name,
        accountType,
      };
    })
  );

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
