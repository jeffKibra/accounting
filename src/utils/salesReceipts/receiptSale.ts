import {
  Transaction,
  increment,
  serverTimestamp,
  Timestamp,
  doc,
} from 'firebase/firestore';

import { dbCollections } from '../firebase';
import formats from '../formats';
import Sale, { SaleDataAndAccount } from '../sales/sale';
import MonthlySummary from '../summaries/monthlySummary';

import { Org, Account, SalesReceiptForm, SalesReceipt } from 'types';

interface ReceiptDetails {
  accounts: Account[];
  org: Org;
  salesReceiptId: string;
  userId: string;
}

export default class ReceiptSale extends Sale {
  constructor(transaction: Transaction, receiptDetails: ReceiptDetails) {
    const { accounts, org, salesReceiptId, userId } = receiptDetails;

    super(transaction, {
      accounts,
      org,
      transactionId: salesReceiptId,
      transactionType: 'sales_receipt',
      userId,
    });
  }

  async create(incomingReceipt: SalesReceiptForm) {
    const {
      account,
      customer: { customerId },
      paymentMode: { value: paymentModeId },
      summary: saleSummary,
    } = incomingReceipt;
    const { totalAmount } = saleSummary;
    const { accountsSummary, accountsMapping } = this.initCreateSale(
      incomingReceipt,
      account
    );
    const {
      transaction,
      org: { orgId },
      org,
      userId,
      transactionId,
    } = this;

    const summary = new MonthlySummary(transaction, orgId);

    summary.appendObject({ ...accountsSummary, salesReceipts: increment(1) });
    summary.appendPaymentMode(paymentModeId, totalAmount, 0);
    summary.append('cashFlow.incoming', totalAmount, 0);

    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);
    /**
     * create sales
     */
    this.createSale(incomingReceipt, accountsMapping);
    /**
     * create sales receipt
     */

    if (!incomingReceipt) {
      throw new Error('Incoming Sales receipt required!');
    }

    /**
     * create salesReceipt
     */
    const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
    const salesReceiptRef = doc(salesReceiptsCollection, transactionId);
    // console.log({ salesReceiptData });
    transaction.set(salesReceiptRef, {
      ...incomingReceipt,
      status: 'active',
      isSent: false,
      transactionType: 'sales_receipt',
      org: formats.formatOrgData(org),
      createdBy: userId,
      createdAt: serverTimestamp() as Timestamp,
      modifiedBy: userId,
      modifiedAt: serverTimestamp() as Timestamp,
    });
  }

  getCurrentReceipt() {
    const {
      transaction,
      org: { orgId },
      transactionId,
    } = this;

    return ReceiptSale.getSalesReceiptData(transaction, orgId, transactionId);
  }

  async update(incomingReceipt: SalesReceiptForm) {
    const currentReceipt = await this.getCurrentReceipt();

    const {
      transaction,
      org: { orgId },
      userId,
      transactionId,
    } = this;

    const incomingReceiptAndAccount: SaleDataAndAccount = {
      saleDetails: incomingReceipt,
      saleAccount: incomingReceipt.account,
    };
    const currentReceiptAndAccount: SaleDataAndAccount = {
      saleDetails: currentReceipt,
      saleAccount: currentReceipt.account,
    };

    const {
      accountsMapping,
      accountsSummary,
      entriesToDelete,
      entriesToUpdate,
    } = await this.initUpdateSale(
      incomingReceiptAndAccount,
      currentReceiptAndAccount
    );

    const {
      summary: { totalAmount: incomingTotal },
      customer: { customerId: incomingCustomerId },
      paymentMode: { value: incomingPaymentModeId },
    } = incomingReceipt;

    const {
      customer: { customerId: currentCustomerId },
      summary: { totalAmount: currentTotal },
      paymentMode: { value: currentPaymentModeId },
    } = currentReceipt;

    /**
     * update sale
     */
    this.updateSale(
      incomingReceipt,
      accountsMapping,
      entriesToUpdate,
      entriesToDelete
    );

    //update org summary
    const orgSummary = new MonthlySummary(transaction, orgId);
    orgSummary.appendObject(accountsSummary);
    orgSummary.append('cashFlow.incoming', incomingTotal, currentTotal);

    if (incomingPaymentModeId === currentPaymentModeId) {
      orgSummary.appendPaymentMode(
        incomingPaymentModeId,
        incomingTotal,
        currentTotal
      );
    } else {
      orgSummary.appendPaymentMode(incomingPaymentModeId, incomingTotal, 0);
      orgSummary.appendPaymentMode(currentPaymentModeId, 0, currentTotal);
    }

    orgSummary.updateOrgSummary();
    /**
     * update customers summaries
     */
    const customerHasChanged = currentCustomerId !== incomingCustomerId;
    if (customerHasChanged) {
      const {
        incomingCustomerAccountsSummary,
        currentCustomerAccountsSummary,
      } = await this.getChangedCustomersAccountsSummaries(
        incomingReceiptAndAccount,
        currentReceiptAndAccount
      );

      const incomingCustomerSummary = new MonthlySummary(transaction, '');
      incomingCustomerSummary.appendObject(incomingCustomerAccountsSummary);
      incomingCustomerSummary.append('salesReceipts', 1, 0);
      incomingCustomerSummary.append('cashFlow.incoming', incomingTotal, 0);
      incomingCustomerSummary.appendPaymentMode(
        incomingPaymentModeId,
        incomingTotal,
        0
      );
      //
      const currentCustomerSummary = new MonthlySummary(transaction, '');
      currentCustomerSummary.appendObject(currentCustomerAccountsSummary);
      currentCustomerSummary.append('deletedSalesReceipts', 1, 0);
      currentCustomerSummary.append('cashFlow.incoming', 0, currentTotal);
      currentCustomerSummary.appendPaymentMode(
        currentPaymentModeId,
        0,
        currentTotal
      );

      this.changeCustomers({
        incomingCustomer: {
          id: incomingCustomerId,
          summary: {
            ...incomingCustomerSummary.data,
          },
        },
        currentCustomer: {
          id: currentCustomerId,
          summary: {
            ...currentCustomerSummary.data,
          },
        },
      });
    } else {
      const customerSummary = new MonthlySummary(transaction, orgId);
      customerSummary.appendObject(orgSummary.data);

      customerSummary.updateCustomerSummary(incomingCustomerId);
    }
    /**
     * update sales receipt
     */
    const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
    const salesReceiptRef = doc(salesReceiptsCollection, transactionId);
    transaction.update(salesReceiptRef, {
      ...incomingReceipt,
      // classical: "plus",
      modifiedBy: userId,
      modifiedAt: serverTimestamp(),
    });
  }

  async deleteReceipt() {
    const receiptData = await this.getCurrentReceipt();
    const {
      transaction,
      transactionId,
      org: { orgId },
      userId,
    } = this;

    const {
      customer: { customerId },
      summary: { totalAmount },
      paymentMode: { value: paymentModeId },
    } = receiptData;

    /**
     *init delete sale after setting current receipt
     */
    const { accountsSummary, entriesToDelete } = await this.initDeleteSale({
      saleAccount: receiptData.account,
      saleDetails: receiptData,
    });

    /**
     * delete sale
     */
    this.deleteSale(entriesToDelete);
    /**
     * delete sale receipt
     */
    const summary = new MonthlySummary(transaction, orgId);
    summary.appendObject(accountsSummary);
    summary.appendPaymentMode(paymentModeId, 0, totalAmount);
    summary.append('cashFlow.incoming', 0, totalAmount);
    summary.append('deletedSalesReceipts', 0, 1);

    summary.updateOrgSummary();
    summary.updateCustomerSummary(customerId);

    /**
     * mark salesReceipt as deleted
     */
    const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
    const salesReceiptRef = doc(salesReceiptsCollection, transactionId);
    transaction.update(salesReceiptRef, {
      status: 'deleted',
      modifiedBy: userId,
      modifiedAt: serverTimestamp(),
    });
  }

  //----------------------------------------------------------------------
  //static functions
  //----------------------------------------------------------------------
  static async getSalesReceiptData(
    transaction: Transaction,
    orgId: string,
    salesReceiptId: string
  ): Promise<SalesReceipt> {
    const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
    const salesReceiptRef = doc(salesReceiptsCollection, salesReceiptId);
    const salesReceiptDoc = await transaction.get(salesReceiptRef);
    const salesReceiptData = salesReceiptDoc.data();

    if (
      !salesReceiptDoc.exists ||
      !salesReceiptData ||
      salesReceiptData.status === 'deleted'
    ) {
      throw new Error(`Sales Receipt with id ${salesReceiptId} not found!`);
    }

    return {
      ...salesReceiptData,
      salesReceiptId,
    };
  }
}
