import getIncomeAccounts from "./getIncomeAccounts";

/**
 *
 * @param {[{}]} items
 * @param {[{}]} incomingItems
 * @returns {{uniqueAccounts:[{current:0,incoming:0,accountId:""}],similarAccounts:[{current:0,incoming:0,accountId:""}],updatedAccounts:[{current:0,incoming:0,accountId:""}],deletedAccounts:[{current:0,incoming:0,accountId:""}],newAccounts:[{current:0,incoming:0,accountId:""}]}}
 */
export default function getIncomeAccountsMapping(
  items = [],
  incomingItems = []
) {
  /**
   * group both items arrays into their respective income accounts
   */
  const currentAccounts = getIncomeAccounts(items);
  const incomingAccounts = getIncomeAccounts(incomingItems);

  const similarAccounts = [];
  const updatedAccounts = [];
  const newAccounts = [];
  const deletedAccounts = [];

  currentAccounts.forEach((account) => {
    const { accountId, itemsTotal } = account;
    let dataMapping = { current: itemsTotal, incoming: 0, accountId };
    /**
     * find if this income account is also in incoming accounts
     */
    const index = incomingAccounts.findIndex(
      (incomingAccount) => incomingAccount.accountId === accountId
    );

    if (index > -1) {
      /**
       * account is in both arrays
       * remove account from incomingAccounts array
       */
      const incomingTotal = incomingAccounts.splice(index, 1)[0].itemsTotal;
      dataMapping.incoming = incomingTotal;
      if (dataMapping.current === incomingTotal) {
        similarAccounts.push(dataMapping);
      } else {
        updatedAccounts.push(dataMapping);
      }
    } else {
      /**
       * account is in only the currentAccounts array
       * this means this account is to be deleted
       */
      deletedAccounts.push(dataMapping);
    }
  });

  /**
   * check if there are items remaining in the incoming accounts array
   * add them the new accounts array
   */
  if (incomingAccounts.length > 0) {
    incomingAccounts.forEach((account) => {
      const { itemsTotal, accountId } = account;
      const dataMapping = { current: 0, incoming: itemsTotal, accountId };

      newAccounts.push(dataMapping);
    });
  }

  const uniqueAccounts = [
    ...similarAccounts,
    ...deletedAccounts,
    ...newAccounts,
    ...updatedAccounts,
  ];

  return {
    uniqueAccounts,
    similarAccounts,
    deletedAccounts,
    newAccounts,
    updatedAccounts,
  };
}
