import {
  Transaction,
  serverTimestamp,
  doc,
  increment,
} from 'firebase/firestore';

import { db, dbCollections } from '../firebase';
import { getDateDetails } from '../dates';
import formats from '../formats';
import Sale from '../sales/sale';

import {
  Org,
  UserProfile,
  Account,
  SalesReceiptForm,
  SalesReceipt,
} from 'types';

interface ReceiptDetails {
  accounts: Account[];
  org: Org;
  salesReceiptId: string;
  userProfile: UserProfile;
  receiptData: SalesReceiptForm;
}

export default class ReceiptSale extends Sale {
  incomingReceipt: SalesReceiptForm | null;
  currentReceipt: SalesReceipt | null;

  constructor(transaction: Transaction, receiptDetails: ReceiptDetails) {
    const { accounts, org, salesReceiptId, userProfile, receiptData } =
      receiptDetails;

    super(transaction, {
      accounts,
      incomingSaleAccount: receiptData.account,
      incomingSaleData: receiptData,
      org,
      transactionId: salesReceiptId,
      transactionType: 'sales_receipt',
      userProfile,
    });

    this.incomingReceipt = receiptData;
    this.currentReceipt = null;
  }

  initCreateReceipt() {
    /**
     * init sale creation
     */
    this.initCreateSale();
  }

  createSalesReceipt() {
    this.initCreateReceipt();
    /**
     * create sales
     */
    this.createSale();
    /**
     * create sales receipt
     */
    const { transaction, org, userProfile, transactionId, incomingReceipt } =
      this;

    if (!incomingReceipt) {
      throw new Error('Incoming Sales receipt required!');
    }

    const { orgId } = org;
    const { email } = userProfile;
    const { customer, summary, paymentMode } = incomingReceipt;
    const { customerId } = customer;
    const { value: paymentModeId } = paymentMode;
    const { totalAmount } = summary;

    /**
     * update customer summaries if a customer was selected
     */
    if (customerId) {
      const customerRef = doc(
        db,
        'organizations',
        orgId,
        'customers',
        customerId
      );

      transaction.update(customerRef, {
        'summary.salesReceipts': increment(1),
        'summary.salesReceiptsAmount': increment(summary.totalAmount),
      });
    }
    /**
     * update org summaries
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
      salesReceipts: increment(1),
      [`paymentModes.${paymentModeId}`]: increment(totalAmount),
      'cashFlow.incoming': increment(totalAmount),
    });

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
      createdBy: email,
      createdAt: serverTimestamp(),
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  async fetchCurrentReceipt() {
    const {
      transaction,
      org: { orgId },
      transactionId,
    } = this;

    const currentSalesReceipt = await ReceiptSale.getSalesReceiptData(
      transaction,
      orgId,
      transactionId
    );

    this.currentReceipt = currentSalesReceipt;
  }

  async initUpdateReceipt() {
    /**
     * init update sale
     */
    await this.initUpdateSale();
    /**
     * init update receipt
     */
    await this.fetchCurrentReceipt();

    const { incomingReceipt, currentReceipt } = this;

    if (!incomingReceipt || !currentReceipt) {
      throw new Error('Incoming and current receipt required in an update');
    }

    const { summary, paymentMode } = incomingReceipt;
    const { value: paymentModeId } = paymentMode;
    const { totalAmount } = summary;

    const {
      paymentMode: { value: currentPaymentModeId },
      summary: currentSummary,
    } = currentReceipt;

    /**
     * update summary payment modes
     */
    if (currentPaymentModeId === paymentModeId) {
      if (currentSummary.totalAmount !== totalAmount) {
        this.summaryInstance.appendPaymentMode(
          paymentModeId,
          totalAmount,
          currentSummary.totalAmount
        );
      }
    } else {
      this.summaryInstance.appendPaymentMode(paymentModeId, totalAmount, 0);
      this.summaryInstance.appendPaymentMode(
        currentPaymentModeId,
        0,
        currentSummary.totalAmount
      );
    }
    /**
     * update cashflow
     */
    this.summaryInstance.append(
      'cashFlow.incoming',
      totalAmount,
      currentSummary.totalAmount
    );
  }

  async updateSalesReceipt() {
    await this.initUpdateReceipt();
    /**
     * update sale
     */
    this.updateSale();
    /**
     * update receipt
     */
    const {
      transaction,
      org: { orgId },
      userProfile,
      incomingReceipt,
      currentReceipt,
      transactionId,
    } = this;

    if (!incomingReceipt || !currentReceipt) {
      throw new Error('Incoming and current receipt required in an update');
    }

    const { email } = userProfile;
    const { summary, customer } = incomingReceipt;
    const { customerId } = customer;
    // console.log({ data });
    const { totalAmount } = summary;

    const {
      customer: { customerId: currentCustomerId },
      summary: currentSummary,
    } = currentReceipt;

    /**
     * start writing
     */

    /**
     * update customer summaries
     */
    const newCustomerRef = customerId
      ? doc(db, 'organizations', orgId, 'customers', customerId)
      : null;
    const currentCustomerRef = currentCustomerId
      ? doc(db, 'organizations', orgId, 'customers', currentCustomerId)
      : null;
    /**
     * opening balance is strictly tied to a customer.
     * cant change hence no need to change anything
     */
    /**
     * check if customer has been changed
     */
    const customerHasChanged = currentCustomerId !== customerId;
    if (customerHasChanged) {
      //delete values from previous customer
      if (currentCustomerRef) {
        transaction.update(currentCustomerRef, {
          'summary.salesReceiptsAmount': increment(
            0 - currentSummary.totalAmount
          ),
          'summary.deletedSalesReceipts': increment(1),
        });
      }
      if (newCustomerRef) {
        //add new values to the incoming customer
        transaction.update(newCustomerRef, {
          'summary.salesReceiptsAmount': increment(totalAmount),
          'summary.salesReceipts': increment(1),
        });
      }
    } else {
      if (currentCustomerRef) {
        if (currentSummary.totalAmount !== totalAmount) {
          const adjustment = totalAmount - currentSummary.totalAmount;
          //update customer summaries
          transaction.update(currentCustomerRef, {
            'summary.salesReceiptsAmount': increment(adjustment),
          });
        }
      }
    }

    /**
     * update sales receipt
     */
    const salesReceiptsCollection = dbCollections(orgId).salesReceipts;
    const salesReceiptRef = doc(salesReceiptsCollection, transactionId);
    transaction.update(salesReceiptRef, {
      ...incomingReceipt,
      // classical: "plus",
      modifiedBy: email,
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
