import { getCustomerEntryData } from "../journals";

/**
 *
 * @param {""} orgId
 * @param {{}} invoice
 * @param {[{accountId:"", current:0, incoming:0}]} incomeAccounts
 * @returns {[{incoming:0,current:0,accountId:0,debit:0,credit:0,entryId:""}] Promise}
 */
export default async function getIncomeEntries(
  orgId = "",
  invoice = {
    invoiceId: "",
    customerId: "",
    invoiceSlug: "",
  },
  incomeAccounts = [{ incoming: 0, current: 0, accountId: "" }]
) {
  /**
   * get items to update
   */
  const { customerId, invoiceSlug } = invoice;

  const entries = await Promise.all(
    incomeAccounts.map(async (account) => {
      const { accountId } = account;
      const entryData = await getCustomerEntryData(
        orgId,
        customerId,
        accountId,
        invoiceSlug,
        "invoice"
      );

      return {
        ...account,
        ...entryData,
      };
    })
  );

  return entries;
}
