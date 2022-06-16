import { updateSimilarAccountEntries } from "../journals";

export default function updatePaymentEntries(
  transaction,
  userProfile = { email: "" },
  orgId = "",
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
  updateSimilarAccountEntries(
    transaction,
    userProfile,
    orgId,
    account,
    entries.map((entry) => {
      const {
        incoming,
        entry: { credit, debit, entryId },
      } = entry;
      return {
        amount: incoming,
        account,
        credit,
        debit,
        entryId,
        reference,
        transactionDetails,
        transactionId: paymentSlug,
        transactionType: "customer payment",
      };
    })
  );
}
