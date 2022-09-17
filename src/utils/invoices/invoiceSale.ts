import {
  increment,
  serverTimestamp,
  DocumentReference,
  Transaction,
  Timestamp,
  doc,
} from 'firebase/firestore';

import { dbCollections } from '../firebase';
import formats from '../formats';
import { getInvoiceData, getInvoicePaymentsTotal } from './utils';
//Sale class
import Sale from '../sales/sale';
import Summary from 'utils/summaries/summary';

import {
  Org,
  Account,
  InvoiceFormData,
  InvoiceFromDb,
  InvoiceTransactionTypes,
  Invoice,
  AccountsMapping,
  Entry,
  MappedEntry,
} from 'types';
import { getAccountData } from '../accounts';

//----------------------------------------------------------------

export interface InvoiceDetails {
  invoiceId: string;
  userId: string;
  org: Org;
  accounts: Account[];
  transactionType: keyof InvoiceTransactionTypes;
}

export default class InvoiceSale extends Sale {
  invoiceRef: DocumentReference<InvoiceFromDb>;
  // incomingInvoice: InvoiceFormData | null;
  // currentInvoice: Invoice | null;
  ARAccount: Account;

  errors: {
    [key: string]: string;
  } = {
    incoming: 'Please provide incoming invoice data',
  };

  constructor(transaction: Transaction, invoiceDetails: InvoiceDetails) {
    console.log({ invoiceDetails });
    const { accounts, transactionType, invoiceId, org, userId } =
      invoiceDetails;

    super(transaction, {
      accounts,
      org,
      transactionId: invoiceId,
      transactionType,
      userId,
    });

    const ARAccount = getAccountData('accounts_receivable', accounts);
    if (!ARAccount) {
      throw new Error('Accounts receivable account not found!');
    }
    this.ARAccount = ARAccount;

    const invoicesCollection = dbCollections(org.orgId).invoices;
    this.invoiceRef = doc(invoicesCollection, invoiceId);
  }

  async getCurrentInvoice() {
    const {
      transaction,
      org: { orgId },
      transactionId,
    } = this;
    const invoice = await getInvoiceData(transaction, orgId, transactionId);

    return invoice;
  }

  createInvoice(
    incomingInvoice: InvoiceFormData,
    accountsMapping: AccountsMapping
  ) {
    const { transaction, userId, org, transactionType, invoiceRef } = this;
    /**
     * create sale
     */
    this.createSale(incomingInvoice, accountsMapping);

    //create invoice
    console.log({ incomingInvoice });

    transaction.set(invoiceRef, {
      ...incomingInvoice,
      balance: incomingInvoice.summary.totalAmount,
      paymentsReceived: {},
      paymentsIds: [],
      paymentsCount: 0,
      status: 0,
      isSent: false,
      transactionType: transactionType as keyof InvoiceTransactionTypes,
      org: formats.formatOrgData(org),
      createdBy: userId,
      createdAt: serverTimestamp() as Timestamp,
      modifiedBy: userId,
      modifiedAt: serverTimestamp() as Timestamp,
    });
  }

  validateUpdate(incomingInvoice: InvoiceFormData, currentInvoice: Invoice) {
    const {
      summary: { totalAmount },
      customer: { customerId },
    } = incomingInvoice;
    const {
      paymentsReceived,
      customer: { customerId: currentCustomerId },
    } = currentInvoice;
    /**
     * check to ensure the new total balance is not less than payments made.
     */
    const paymentsTotal = getInvoicePaymentsTotal(paymentsReceived || {});
    /**
     * trying to update invoice total with an amount less than paymentsTotal
     * throw an error
     */
    if (paymentsTotal > totalAmount) {
      throw new Error(
        `Invoice Update Failed! The new Invoice Total is less than the invoice payments. If you are sure you want to edit, delete the associated payments or adjust them to be less than or equal to the new invoice total`
      );
    }
    /**
     * check if customer has been changed
     */
    const customerHasChanged = currentCustomerId !== customerId;
    /**
     * customer cannot be changed if the invoice has some payments made to it
     */
    if (paymentsTotal > 0 && customerHasChanged) {
      throw new Error(
        `CUSTOMER cannot be changed in an invoice that has payments! This is because all the payments are from the PREVIOUS customer. If you are sure you want to change the customer, DELETE the associated payments first!`
      );
    }
  }

  updateInvoice(
    incomingInvoice: InvoiceFormData,
    accountsMapping: AccountsMapping,
    currentTotal: number,
    entriesToUpdate: MappedEntry[],
    entriesToDelete: MappedEntry[]
  ) {
    //update invoice
    const { transaction, userId } = this;

    const {
      summary: { totalAmount },
    } = incomingInvoice;

    /**
     * update sale
     */
    this.updateSale(
      incomingInvoice,
      accountsMapping,
      entriesToUpdate,
      entriesToDelete
    );

    /**
     * calculate balance adjustment
     */
    const balanceAdjustment = totalAmount - currentTotal;
    /**
     * update invoice
     */
    const invoice: Partial<InvoiceFromDb> = {
      ...incomingInvoice,
      balance: increment(balanceAdjustment) as unknown as number,
      modifiedBy: userId,
      modifiedAt: serverTimestamp() as Timestamp,
    };

    transaction.update(this.invoiceRef, {
      ...invoice,
    });
  }

  deleteInvoice(invoice: Invoice, entries: Entry[]) {
    const { transaction, userId, invoiceRef } = this;
    /**
     * check if the invoice has payments
     */
    const paymentsTotal = getInvoicePaymentsTotal(invoice.paymentsReceived);
    if (paymentsTotal > 0) {
      //deletion not allowed
      throw new Error(
        `Invoice Deletion Failed! You cannot delete an invoice that has payments! If you are sure you want to delete it, Please DELETE all the associated PAYMENTS first!`
      );
    }
    /**
     * delete sale
     */
    this.deleteSale(entries);
    /**
     * mark invoice as deleted
     */
    console.log('deleting invoice');
    transaction.update(invoiceRef, {
      status: -1,
      // opius: "none",
      modifiedBy: userId,
      modifiedAt: serverTimestamp(),
    });
  }

  //----------------------------------------------------------------
  //static methods
  //----------------------------------------------------------------

  static async createInvoiceId(
    transaction: Transaction,
    orgId: string,
    accounts: Account[]
  ) {
    const summary = new Summary(transaction, orgId, accounts);

    const orgSummaryRef = Summary.createOrgRef(orgId);

    const summaryData = await summary.fetchSummaryData(orgSummaryRef.path);
    console.log({ summaryData });
    const currentInvoices = summaryData?.invoices as number;
    const invoiceNumber = (currentInvoices || 0) + 1;
    const invoiceId = `INV-${String(invoiceNumber).padStart(6, '0')}`;

    return invoiceId;
  }
}
