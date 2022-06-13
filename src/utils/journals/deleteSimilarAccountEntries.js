import getRawAmount from "./getRawAmount";
import { verifyAccountId } from "./helpers";
import deleteEntry from "./deleteEntry";
import updateAccount from "./updateAccount";

export default function deleteSimilarAccountEntries(
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
      entryId: "",
      account: {
        accountId: "",
        accountType: { id: "", main: "", name: "" },
        name: "",
      },
      debit: 0,
      credit: 0,
    },
  ]
) {
  /**
   * compute adjustment to be applied.
   * value is also given the correct sign (+ve || -ve)
   */
  const adjustment = calculateAccountAdjustment(entries);
  /**
   * add adjustment to the accounts amount
   */
  updateAccount(transaction, orgId, account.accountId, adjustment);
  /**
   * delete entries
   */
  entries.forEach((entry) => {
    const {
      entryId,
      account: { accountId },
    } = entry;
    /**
     * check to ensure all entries have same account
     */
    verifyAccountId(account.accountId, accountId);
    /**
     * update individual entry
     */
    deleteEntry(transaction, userProfile, orgId, entryId);
  });
}

function calculateAccountAdjustment(
  entries = [{ debit: 0, credit: 0, account: { accountType: {} } }]
) {
  const sum = entries.reduce((sum, entry) => {
    const {
      credit,
      debit,
      account: { accountType },
    } = entry;

    const prevAmount = getRawAmount(accountType, {
      debit,
      credit,
    });

    return sum + +prevAmount;
  }, 0);
  /**
   * subtract sum from zero(0) to get the amount of adjustment.
   * if sum is +ve, adjustment should be negative
   * the reverse is also true
   */
  return 0 - sum;
}
