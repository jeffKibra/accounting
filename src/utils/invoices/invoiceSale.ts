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
import Sale, { SaleDataAndAccount } from '../sales/sale';
import Summary from '../summaries/summary';

import {
  Org,
  Account,
  InvoiceFormData,
  InvoiceFromDb,
  InvoiceTransactionTypes,
  Invoice,
  AccountsMapping,
  Entry,
} from 'types';
import { getAccountData } from '../accounts';

//----------------------------------------------------------------

interface InvoiceDetails {
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

  async create(incomingInvoice: InvoiceFormData) {
    const {
      customer: { customerId },
    } = incomingInvoice;
    const {
      org: { orgId },
      transaction,
      transactionType,
    } = this;
    const { accountsMapping, accountsSummary } = this.initCreateSale(
      incomingInvoice,
      this.ARAccount
    );

    //initialize summaries
    const summary = new Summary(transaction, orgId, this.accounts);

    if (transactionType === 'invoice') {
      summary.appendObject({ ...accountsSummary, invoices: increment(1) });
    }
    //update summaries on given collections
    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);

    //create invoice
    this.createInvoice(incomingInvoice, accountsMapping);
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

  async update(incomingInvoice: InvoiceFormData) {
    const currentInvoice = await this.getCurrentInvoice();
    /**
     * initialize sale update-happens after fetching current invoice
     */
    const incomingInvoiceAndAccount: SaleDataAndAccount = {
      saleDetails: incomingInvoice,
      saleAccount: this.ARAccount,
    };
    const currentInvoiceAndAccount: SaleDataAndAccount = {
      saleDetails: currentInvoice,
      saleAccount: this.ARAccount,
    };
    const {
      accountsSummary,
      entriesToDelete,
      entriesToUpdate,
      accountsMapping,
    } = await this.initUpdateSale(
      incomingInvoiceAndAccount,
      currentInvoiceAndAccount
    );
    //update invoice
    const {
      transaction,
      org: { orgId },
      userId,
      transactionType,
    } = this;

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
    this.updateSale(
      incomingInvoice,
      accountsMapping,
      entriesToUpdate,
      entriesToDelete
    );

    /**
     * update customer summaries
     * only allowed where transactionType is invoice
     */
    if (transactionType === 'invoice') {
      /**
       * check if customer has been changed
       */
      const customerHasChanged = currentCustomerId !== customerId;

      if (customerHasChanged) {
        const {
          incomingCustomerAccountsSummary,
          currentCustomerAccountsSummary,
        } = await this.getChangedCustomersAccountsSummaries(
          incomingInvoiceAndAccount,
          currentInvoiceAndAccount
        );

        await this.changeCustomers({
          incomingCustomer: {
            id: customerId,
            summary: {
              ...incomingCustomerAccountsSummary,
              deletedInvoices: increment(1),
            },
          },
          currentCustomer: {
            id: currentCustomerId,
            summary: {
              ...currentCustomerAccountsSummary,
              invoices: increment(1),
            },
          },
        });
      } else {
        const customerSummary = new Summary(transaction, orgId, this.accounts);
        //initialize summaries
        customerSummary.appendObject(accountsSummary);
        customerSummary.updateCustomerSummary(customerId);
      }
    }
    const orgSummary = new Summary(transaction, orgId, this.accounts);
    //initialize summary
    orgSummary.appendObject(accountsSummary);
    orgSummary.updateOrgSummary();

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

  async delete() {
    const {
      ARAccount,
      transaction,
      org: { orgId },
      transactionType,
    } = this;

    const currentInvoice = await this.getCurrentInvoice();
    const currentInvoiceAndAccount: SaleDataAndAccount = {
      saleDetails: currentInvoice,
      saleAccount: ARAccount,
    };
    const {
      customer: { customerId },
    } = currentInvoice;

    const { accountsSummary, entriesToDelete } = await this.initDeleteSale(
      currentInvoiceAndAccount
    );

    const summary = new Summary(transaction, orgId, this.accounts);
    summary.appendObject(accountsSummary);

    if (transactionType === 'invoice') {
      summary.append('deletedInvoices', 0, 1);
    }
    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);
    /**
     * delete invoice
     */

    this.deleteInvoice(currentInvoice, entriesToDelete);
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
}
