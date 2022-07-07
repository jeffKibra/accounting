import { changeEntriesAccount } from "../journals";

import { Transaction } from "firebase/firestore";
import {
  UserProfile,
  Account,
  PaymentReceivedFormWithId,
  MappedEntry,
} from "../../types";

interface Payment {
  account: Account;
}

export default function changePaymentAccount(
  transaction: Transaction,
  userProfile: UserProfile,
  orgId: string,
  payment: Payment,
  transactionDetails: PaymentReceivedFormWithId,
  entries: MappedEntry[]
) {
  const { account, reference, paymentId } = transactionDetails;
  changeEntriesAccount(
    transaction,
    userProfile,
    orgId,
    payment.account,
    account,
    entries.map((entry) => {
      const { incoming, accountId, current, ...prevEntry } = entry;
      const { account } = prevEntry;
      return {
        amount: incoming,
        prevAccount: account,
        prevEntry,
        reference,
        transactionId: paymentId,
        transactionDetails: { ...transactionDetails },
        transactionType: "customer payment",
      };
    })
  );
}
