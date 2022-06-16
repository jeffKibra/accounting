import updateAccount from "./updateAccount";
import createEntry from "./createEntry";
import { verifyAccountId } from "./helpers";

export default function createSimilarAccountEntries(
  transaction,
  userProfile,
  orgId,
  account = {
    accountId: "",
    accountType: { id: "", main: "", name: "" },
    name: "",
  },
  entries = [
    {
      amount: 0,
      transactionType: "",
      transactionId: "",
      transactionDetails: "",
      reference: "",
      account: {
        accountId: "",
        accountType: { id: "", main: "", name: "" },
        name: "",
      },
    },
  ]
) {
  /**
   * compute adjustments for the two main accounts
   */
  const adjustment = calculateAccountAdjustment(entries);
  /**
   * update new account
   * add adjustment to the accounts amount
   */
  updateAccount(transaction, orgId, account.accountId, adjustment);
  /**
   * create entries
   */
  entries.forEach((entry) => {
    const {
      account: { accountId },
    } = entry;
    /**
     * check to ensure all entries have same account
     */
    verifyAccountId(account.accountId, accountId);
    /**
     * create the entry
     */
    createEntry(transaction, userProfile, orgId, entry);
  });
}

function calculateAccountAdjustment(entries = [{ amount: 0 }]) {
  return entries.reduce((sum, entry) => {
    return sum + +entry.amount;
  }, 0);
}
