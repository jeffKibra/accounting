import { updateSimilarAccountEntries } from "../journals";

import {
  UserProfile,
  PaymentReceivedDetails,
  InvoicePaymentEntry,
} from "../../types";
import { Transaction } from "firebase/firestore";

export default function updatePaymentEntries(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  transactionDetails: PaymentReceivedDetails,
  entries: InvoicePaymentEntry[]
) {
  const { account, reference, paymentId } = transactionDetails;
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
        transactionDetails: { ...transactionDetails },
        transactionId: paymentId,
        transactionType: "customer payment",
      };
    })
  );
}
