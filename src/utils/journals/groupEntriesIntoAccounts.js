/**
 *
 * @param {[{account:{accountId: "",accountType:{} },credit:0,debit:0,entryId:"",},]}entries
 * @returns {[{accountId:'',accountType:{},name:'',entries:[{account:{},debit:0,credit:0,entryId:""}]}]} accounts
 */

export default function groupEntriesIntoAccounts(
  entries = [
    {
      account: { accountId: "", accountType: {} },
      credit: 0,
      debit: 0,
      entryId: "",
    },
  ]
) {
  return entries.reduce((accounts, entry) => {
    console.log({ accounts });
    const {
      account: { accountId },
    } = entry;
    const index = accounts.findIndex(
      (account) => account.accountId === accountId
    );
    console.log({ index });

    if (index === -1) {
      //account not in summary yet
      return [
        ...accounts,
        {
          ...entry.account,
          entries: [entry],
        },
      ];
    } else {
      //account has been found
      return accounts.map((account, i) => {
        if (i === index) {
          const { entries } = account;
          return {
            ...account,
            entries: [...entries, entry],
          };
        } else {
          return account;
        }
      });
    }
  }, []);
}
