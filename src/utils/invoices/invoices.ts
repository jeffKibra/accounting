import {
  increment,
  DocumentReference,
  Transaction,
  doc,
} from 'firebase/firestore';

import { dbCollections } from '../firebase';
import { getInvoiceData } from './utils';
//Sale class
import { SaleDataAndAccount } from '../sales/sale';
import Summary from '../summaries/summary';
import InvoiceSale, { InvoiceDetails } from './invoiceSale';

import { Account, InvoiceFormData, InvoiceFromDb } from 'types';
import { getAccountData } from '../accounts';

//----------------------------------------------------------------

export default class Invoices extends InvoiceSale {
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
      invoiceId,
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

  async update(incomingInvoice: InvoiceFormData) {
    const currentInvoice = await this.getCurrentInvoice();
    this.validateUpdate(incomingInvoice, currentInvoice);
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
      accountsMapping,
      accountsSummary,
      entriesToDelete,
      entriesToUpdate,
    } = await this.initUpdateSale(
      incomingInvoiceAndAccount,
      currentInvoiceAndAccount
    );

    //update invoice
    const {
      transaction,
      org: { orgId },
    } = this;

    const {
      customer: { customerId },
    } = incomingInvoice;

    const {
      customer: { customerId: currentCustomerId },
    } = currentInvoice;

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

    const orgSummary = new Summary(transaction, orgId, this.accounts);
    //initialize summary
    orgSummary.appendObject(accountsSummary);
    orgSummary.updateOrgSummary();

    this.updateInvoice(
      incomingInvoice,
      accountsMapping,
      currentInvoice.summary.totalAmount,
      entriesToUpdate,
      entriesToDelete
    );
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
}
