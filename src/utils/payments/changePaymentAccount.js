import { changeAccount } from "../journals";

function changePaymentAccount(
  transaction,
  userProfile = { email: "" },
  orgId = "",
  payment = { account: {} },
  incomingPayment = { account: {} },
  entries = [
    {
      current: 0,
      incoming: 0,
      invoiceId: "",
      accountsReceivable: { debit: 0, credit: 0, entryId: "" },
      paymentAccount: { debit: 0, credit: 0, entryId: "" },
    },
  ]
) {}

export default changePaymentAccount;
