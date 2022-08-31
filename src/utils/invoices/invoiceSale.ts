import {
  doc,
  Transaction,
  DocumentReference,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';

import { dbCollections } from '../firebase';
import formats from '../formats';
import { getInvoiceData, getInvoicePaymentsTotal } from './utils';
//Sale class
import Sale from '../sales/sale';

import {
  UserProfile,
  Org,
  Account,
  InvoiceFormData,
  InvoiceFromDb,
  InvoiceTransactionTypes,
  Invoice,
} from '../../types';
import { getAccountData } from 'utils/accounts';

interface InvoiceDetails {
  invoiceId: string;
  incomingData: InvoiceFormData | null;
  userProfile: UserProfile;
  org: Org;
  accounts: Account[];
  transactionType: keyof InvoiceTransactionTypes;
}

export default class InvoiceSale extends Sale {
  invoiceRef: DocumentReference<InvoiceFromDb>;
  incomingInvoice: InvoiceFormData | null;
  currentInvoice: Invoice | null;

  errors: {
    [key: string]: string;
  } = {
    incoming: 'Please provide incoming invoice data',
  };

  constructor(transaction: Transaction, invoiceDetails: InvoiceDetails) {
    console.log({ invoiceDetails });
    const {
      accounts,
      transactionType,
      incomingData,
      invoiceId,
      org,
      userProfile,
    } = invoiceDetails;

    const ARAccount = getAccountData('accounts_receivable', accounts);
    if (!ARAccount) {
      throw new Error('Accounts receivable account not found!');
    }

    super(transaction, {
      accounts,
      org,
      incomingSaleData: incomingData,
      transactionId: invoiceId,
      transactionType,
      userProfile,
      incomingSaleAccount: ARAccount,
    });

    this.currentSaleAccount = ARAccount;

    this.incomingInvoice = incomingData;
    this.currentInvoice = null;
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

    this.currentInvoice = invoice;
    this.currentSale = invoice;
  }

  private initCreate() {
    /**
     * initialize sale creation
     */
    this.initCreateSale();
    if (this.transactionType === 'invoice') {
      this.summaryInstance.appendObject({ invoices: increment(1) });
    }
  }

  create() {
    //initialize creation
    this.initCreate();
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
      org,
      transactionType,
      invoiceRef,
      incomingInvoice,
    } = this;

    if (!incomingInvoice) {
      throw new Error('Please provide incoming invoice data');
    }

    const {
      customer: { customerId },
      summary: { totalAmount },
    } = incomingInvoice;
    if (transactionType === 'invoice') {
      /**
       * update customer summaries
       */
      const customersCollections = dbCollections(org.orgId).customers;
      const customerRef = doc(customersCollections, customerId);

      transaction.update(customerRef, {
        'summary.invoices': increment(1),
        'summary.invoicedAmount': increment(totalAmount),
      });
    }
    //create invoice

    console.log({ summary: this.dailySummary });

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

  private async initUpdate() {
    const { incomingInvoice } = this;

    if (!incomingInvoice) {
      throw new Error(this.errors['incomingInvoice']);
    }

    console.log({ incomingInvoice });

    await this.getCurrentInvoice();
    /**
     * initialize sale update-happens after fetching current invoice
     */
    await this.initUpdateSale();
  }

  async update() {
    //initialize update first
    await this.initUpdate();
    //update invoice
    const {
      transaction,
      currentInvoice,
      incomingInvoice,
      org: { orgId },
      userProfile,
      transactionType,
    } = this;

    if (!currentInvoice || !incomingInvoice) {
      throw new Error(
        'No invoice to update. Please initialize an update before updating'
      );
    }

    const {
      summary: { totalAmount },
      customer: { customerId },
    } = incomingInvoice;

    const {
      summary: { totalAmount: currentTotal },
      customer: { customerId: currentCustomerId },
      paymentsReceived,
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
     * update sale
     */
    this.updateSale();
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
      modifiedBy: userProfile.email,
      modifiedAt: serverTimestamp() as Timestamp,
    };

    transaction.update(this.invoiceRef, {
      ...invoice,
    });
  }

  private async initDelete() {
    await this.getCurrentInvoice();

    await this.initDeleteSale();

    if (this.transactionType === 'invoice') {
      this.summaryInstance.appendObject({ deleteInvoices: increment(1) });
    }
    /**
     * check if the invoice has payments
     */
    const { currentInvoice, transactionType } = this;
    if (!currentInvoice) {
      throw new Error('Invoice data not found!');
    }
    const paymentsTotal = getInvoicePaymentsTotal(
      currentInvoice.paymentsReceived
    );
    if (paymentsTotal > 0) {
      //deletion not allowed
      throw new Error(
        `Invoice Deletion Failed! You cannot delete an invoice that has payments! If you are sure you want to delete it, Please DELETE all the associated PAYMENTS first!`
      );
    }

    if (transactionType === 'invoice') {
      /**
       * update org counters summaries
       */
      this.summaryInstance.append('deletedInvoices', 1, 0);
    }
  }

  async deleteInvoice(deletionType: 'mark' | 'delete' = 'mark') {
    //init delete
    await this.initDelete();
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
    } = this;

    if (!currentInvoice) {
      throw new Error(
        'No invoice to delete. Please initialize a delete before deleting the invoice'
      );
    }

    const {
      customer: { customerId },
      summary: { totalAmount },
      transactionType,
    } = currentInvoice;

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
