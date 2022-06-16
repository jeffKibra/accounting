import { changeEntriesAccount } from "../journals";

export default function changePaymentAccount(
  transaction,
  userProfile = { email: "" },
  orgId = "",
  payment = { account: {} },
  transactionDetails = { account: {} },
  entries = [
    {
      current: 0,
      incoming: 0,
      invoiceId: "",
      entry: { credit: 0, debit: 0, entryId: "" },
    },
  ]
) {
  const { account, reference, paymentSlug } = transactionDetails;
  changeEntriesAccount(
    transaction,
    userProfile,
    orgId,
    payment.account,
    account,
    entries.map((entry) => {
      const { incoming, entry: prevEntry } = entry;
      return {
        amount: incoming,
        prevAccount: payment.account,
        prevEntry,
        reference,
        transactionDetails,
        transactionId: paymentSlug,
        transactionType: "customer payment",
      };
    })
  );
}
