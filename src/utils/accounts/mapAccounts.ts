/**
 *
 * @typedef {import('.').accountsMapping} accountsMapping
 */
/**
 *
 * @param {{accountId:"", itemsTotal:0}[]} items
 * @param {{accountId:"", itemsTotal:0}[]} incomingItems
 * @returns {accountsMapping} accountsMapping
 */

import { AccountMapping } from "../../models";

type MapAccount = {
  accountId: string;
  itemsTotal: number;
};

export default function mapAccounts(
  currentAccounts: MapAccount[],
  incomingAccounts: MapAccount[]
) {
  const similarAccounts: AccountMapping[] = [];
  const updatedAccounts: AccountMapping[] = [];
  const newAccounts: AccountMapping[] = [];
  const deletedAccounts: AccountMapping[] = [];

  currentAccounts.forEach((account) => {
    const { accountId, itemsTotal } = account;
    let dataMapping: AccountMapping = {
      current: itemsTotal,
      incoming: 0,
      accountId,
    };
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
      const dataMapping: AccountMapping = {
        current: 0,
        incoming: itemsTotal,
        accountId,
      };

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
