import {
  doc,
  Transaction,
  DocumentReference,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';

import { db, dbCollections } from '../firebase';
import Sale from '../sales/sale';
import {
  createEntry,
  updateEntry,
  deleteEntry,
  getAccountEntryForTransaction,
} from '../journals';
import formats from '../formats';
import { getInvoiceData, getInvoicePaymentsTotal } from './utils';
import { getDateDetails } from '../dates';

import {
  UserProfile,
  Org,
  Account,
  InvoiceFormData,
  InvoiceFromDb,
  InvoiceTransactionTypes,
  Invoice,
  Entry,
} from '../../types';
import { getAccountData } from 'utils/accounts';

interface InvoiceDetails {
  invoiceId: string;
  invoiceData: InvoiceFormData;
  userProfile: UserProfile;
  org: Org;
  accounts: Account[];
  transactionType: keyof InvoiceTransactionTypes;
}

export default class InvoiceSale extends Sale {
  account: Account;
  invoiceRef: DocumentReference<InvoiceFromDb>;
  incomingInvoice: InvoiceFormData | null;
  currentInvoice: Invoice | null;
  AREntry: Entry | null;

  errors: {
    [key: string]: string;
  } = {
    incoming: 'Please provide incoming invoice data',
  };

  constructor(transaction: Transaction, invoiceDetails: InvoiceDetails) {
    const {
      accounts,
      transactionType,
      invoiceData,
      invoiceId,
      org,
      userProfile,
    } = invoiceDetails;
    super(transaction, {
      accounts,
      org,
      saleData: invoiceData,
      transactionId: invoiceId,
      transactionType,
      userProfile,
    });

    this.incomingInvoice = invoiceData;
    this.AREntry = null;
    this.currentInvoice = null;
    const invoicesCollection = dbCollections(org.orgId).invoices;
    this.invoiceRef = doc(invoicesCollection, invoiceId);

    const accountId = 'accounts_receivable';
    const account = getAccountData(accountId, accounts);
    if (account) {
      this.account = account;
    } else {
      throw new Error('Accounts receivable not found!');
    }
  }

  initCreate() {
    /**
     * initialize sale creation
     */
    this.initCreate();
  }

  create() {
    /**
     * create sale
     */
    this.createSale();
    /**
     * create invoice
     */
    const {
      transaction,
      userProfile,
      org: { orgId },
      org,
      account,
      incomingSale,
      transactionId,
      transactionType,
      invoiceRef,
      incomingInvoice,
    } = this;

    if (!incomingInvoice) {
      throw new Error('Please provide incoming invoice data');
    }

    //create accounts_receivable entry
    createEntry(transaction, userProfile, orgId, {
      account: account,
      amount: incomingInvoice.summary.totalAmount,
      reference: '',
      transactionDetails: { ...incomingSale },
      transactionId: transactionId,
      transactionType: transactionType,
    });
    //create invoice

    const { email } = userProfile;

    console.log({ incomingInvoice });
    transaction.set(invoiceRef, {
      ...incomingInvoice,
      balance: incomingInvoice.summary.totalAmount,
      paymentsReceived: {},
      paymentsIds: [],
      paymentsCount: 0,
      status: 'active',
      isSent: false,
      transactionType: transactionType as keyof InvoiceTransactionTypes,
      org: formats.formatOrgData(org),
      createdBy: email,
      createdAt: serverTimestamp(),
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  async initUpdate() {
    const {
      incomingInvoice,
      transactionId,
      transaction,
      org: { orgId },
    } = this;

    if (!incomingInvoice) {
      throw new Error(this.errors['incomingInvoice']);
    }

    console.log({ incomingInvoice });
    const { summary, customer } = incomingInvoice;
    const { customerId } = customer;
    // console.log({ data });
    const { totalAmount } = summary;

    const [currentInvoice] = await Promise.all([
      getInvoiceData(transaction, orgId, transactionId),
    ]);
    /**
     * initialize sale update
     */
    this.currentSale = currentInvoice;
    await this.initUpdateSale();

    const {
      customer: { customerId: currentCustomerId },
      paymentsReceived,
      transactionType,
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
    /**
     * get entries data for deletedAccounts and accountsToUpdate
     */
    const AREntry = await getAccountEntryForTransaction(
      orgId,
      'accounts_receivable',
      transactionId,
      transactionType
    );

    this.currentInvoice = currentInvoice;
    this.AREntry = AREntry;
  }

  update() {
    /**
     * update sale
     */
    this.updateSale();
    /**
     * update invoice
     */
    const {
      transaction,
      currentInvoice,
      incomingInvoice,
      AREntry,
      org: { orgId },
      userProfile,
      transactionId,
    } = this;

    if (!currentInvoice || !incomingInvoice || !AREntry) {
      throw new Error(
        'No invoice to update. Please initialize an update before updating'
      );
    }

    const { email } = userProfile;

    const {
      summary: { totalAmount },
      customer,
    } = incomingInvoice;
    const { customerId } = customer;
    const {
      summary: { totalAmount: currentTotal },
      customer: { customerId: currentCustomerId },
      transactionType,
    } = currentInvoice;

    /**
     * update entries
     */
    updateEntry(transaction, userProfile, orgId, {
      ...AREntry,
      amount: totalAmount,
      reference: '',
      transactionDetails: { ...incomingInvoice },
      transactionId,
      transactionType,
    });

    /**
     * update customer summaries
     * only allowed where transactionType is invoice
     */

    if (transactionType === 'invoice') {
      const customersCollection = dbCollections(orgId).customers;
      const newCustomerRef = doc(customersCollection, customerId);
      const currentCustomerRef = doc(customersCollection, currentCustomerId);
      /**
       * check if customer has been changed
       */
      const customerHasChanged = currentCustomerId !== customerId;

      if (customerHasChanged) {
        //delete values from previous customer
        transaction.update(currentCustomerRef, {
          'summary.invoicedAmount': increment(0 - currentTotal),
          'summary.deletedInvoices': increment(1),
        });
        //add new values to the incoming customer
        transaction.update(newCustomerRef, {
          'summary.invoicedAmount': increment(totalAmount),
          'summary.invoices': increment(1),
        });
      } else {
        if (currentTotal !== totalAmount) {
          const adjustment = totalAmount - currentTotal;
          //update customer summaries
          transaction.update(currentCustomerRef, {
            'summary.invoicedAmount': increment(adjustment),
          });
        }
      }
    }
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
      modifiedBy: email,
      modifiedAt: serverTimestamp() as Timestamp,
    };

    transaction.update(this.invoiceRef, {
      ...invoice,
    });
  }

  async initDelete() {
    const {
      transaction,
      org: { orgId },
      transactionId,
      account,
    } = this;
    /**
     * also init sale delete
     */
    const [invoice] = await Promise.all([
      getInvoiceData(transaction, orgId, transactionId),
      this.initDeleteSale(),
    ]);

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
     * fetch AREntry to delete
     */
    const AREntry = await getAccountEntryForTransaction(
      orgId,
      account.accountId,
      transactionId,
      invoice.transactionType
    );

    this.currentInvoice = invoice;
    this.AREntry = AREntry;
  }

  deleteInvoice(deletionType: string = 'mark') {
    /**
     * delete sale
     */
    this.deleteSale();
    /**
     * delete invoice
     */
    const {
      transaction,
      currentInvoice,
      userProfile,
      org: { orgId },
      AREntry,
    } = this;
    if (!currentInvoice || !AREntry) {
      throw new Error(
        'No invoice to delete. Please initialize a delete before deleting the invoice'
      );
    }
    const {
      customer: { customerId },
      summary: { totalAmount },
      transactionType,
    } = currentInvoice;
    /**
     * delete entries and update groupedEntries summaries
     */
    deleteEntry(transaction, userProfile, orgId, AREntry.entryId);

    if (transactionType === 'invoice') {
      /**
       * update customer summaries
       */
      const customersCollection = dbCollections(orgId).customers;
      const customerRef = doc(customersCollection, customerId);
      transaction.update(customerRef, {
        'summary.deletedInvoices': increment(1),
        'summary.invoicedAmount': increment(0 - totalAmount),
      });

      /**
       * update org counters summaries
       */
      const { yearMonthDay } = getDateDetails();
      const summaryRef = doc(
        db,
        'organizations',
        orgId,
        'summaries',
        yearMonthDay
      );
      transaction.update(summaryRef, {
        deletedInvoices: increment(1),
      });
    }
    /**
     * check if invoice should be deleted
     */
    if (deletionType === 'mark') {
      /**
       * mark invoice as deleted
       */
      console.log('marking');
      const { email } = userProfile;
      transaction.update(this.invoiceRef, {
        status: 'deleted',
        // opius: "none",
        modifiedBy: email,
        modifiedAt: serverTimestamp(),
      });
    } else {
      console.log('deleting invoice');
      transaction.delete(this.invoiceRef);
    }
  }
}
