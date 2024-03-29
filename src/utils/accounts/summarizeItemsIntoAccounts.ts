export default function summarizeItemsIntoAccounts(
  items: {
    accountId: string;
    amount: number;
  }[]
) {
  const summaryObject = items.reduce(
    (summary: { [key: string]: number }, item) => {
      const { amount, accountId } = item;

      const currentTotal = summary[accountId];

      return {
        ...summary,
        [accountId]: currentTotal ? currentTotal + amount : amount,
      };
    },
    {}
  );

  return Object.keys(summaryObject).map((accountId) => {
    return {
      accountId,
      amount: summaryObject[accountId],
    };
  });
}
