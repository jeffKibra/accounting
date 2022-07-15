import { changeEntriesAccount } from "../journals";

import { Transaction } from "firebase/firestore";
import {
  UserProfile,
  MappedEntry,
  PaymentReceived,
  PaymentReceivedForm,
} from "../../types";

export default function changePaymentAccount(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  currentPayment: PaymentReceived,
  incomingPayment: PaymentReceivedForm,
  entries: MappedEntry[]
) {
  const { account: incomingAccount, reference } = incomingPayment;
  const { paymentId, account: currentAccount } = currentPayment;
  changeEntriesAccount(
    transaction,
    userProfile,
    orgId,
    currentAccount,
    incomingAccount,
    entries.map((entry) => {
      const { incoming, accountId, current, ...prevEntry } = entry;
      const { account } = prevEntry;
      return {
        amount: incoming,
        prevAccount: account,
        prevEntry,
        reference,
        transactionId: paymentId,
        transactionDetails: { ...incomingPayment },
        transactionType: "customer payment",
      };
    })
  );
}
