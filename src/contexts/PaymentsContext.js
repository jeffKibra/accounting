import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { GET_CUSTOMER_INVOICES } from "../store/actions/invoicesActions";

const initialState = {
  paymentId: "",
  loadingInvoices: false,
  updating: false,
  invoices: [],
  getInvoices: () => {},
  autoPay: () => {},
  editInvoicePayment: () => {},
  summary: { paidAmount: 0, excess: 0, amount: 0 },
  formValues: {},
  updateFormValues: () => {},
  finish: () => {},
  accounts: [],
};

const PaymentsContext = createContext({ ...initialState });
PaymentsContext.displayName = "payments_context";

export default PaymentsContext;

function Provider(props) {
  const {
    updating,
    children,
    paymentId,
    defaultValues,
    saveData,
    loading,
    action,
    invoices,
    getInvoices,
    accounts,
  } = props;

  const [selectedInvoices, setSelectedInvoices] = useState(invoices || []);
  const [formValues, setFormValues] = useState(defaultValues || {});
  const { customerId, amount: paymentAmount } = formValues;

  const updateInvoicePayment = useCallback(
    (
      invoice = {},
      data = { amount: 0, withholdingTax: 0, tdsTaxAccount: "" }
    ) => {
      /**
       * function is to be called after ascertaining no conflicts in summary amount
       */
      // console.log({ data });
      const { invoiceId } = invoice;
      const { amount } = data;
      const paymentData = {
        ...data,
        paymentId,
        invoiceId,
      };

      let payments = { ...invoice.payments };
      const similarPayment = payments[paymentId];

      // console.log({ paymentData, payments });

      if (similarPayment) {
        //create new payments with current payment updated to supplied amount
        if (amount > 0) {
          //only update amounts greater than zero
          payments = {
            ...payments,
            [paymentId]: { ...payments[paymentId], ...paymentData },
          };
        } else {
          //amount is zero, remove payment from list
          delete payments[paymentId];
        }
      } else {
        //create new payment entry
        if (amount > 0) {
          //only add amounts greater than zero
          payments = {
            ...payments,
            [paymentId]: paymentData,
          };
        }
      }

      const totalPaid = Object.keys(payments).reduce((prev, key) => {
        const paidAmount = payments[key].amount || 0;
        return prev + paidAmount;
      }, 0);

      const invoiceTotal = invoice.summary.totalAmount;
      const newBalance = invoiceTotal - totalPaid;
      // console.log({ invoiceTotal, totalPaid, newBalance });
      // console.log({ data, invoiceTotal, newBalance, totalPaid });

      return {
        ...invoice,
        payments,
        summary: {
          ...invoice.summary,
          balance: newBalance,
        },
      };
    },
    [paymentId]
  );

  useEffect(() => {
    //update selected invoices incase invoices change
    if (invoices) {
      setSelectedInvoices(invoices);
    }
  }, [invoices]);

  useEffect(() => {
    const amount = paymentAmount;
    //update selected invoices when paid amount  changes
    if (amount) {
      setSelectedInvoices((currentInvoices) => {
        return currentInvoices.map((invoice) => {
          const updated = updateInvoicePayment(invoice, { amount: 0 });
          return {
            ...invoice,
            ...updated,
          };
        });
      });
    }
  }, [paymentAmount, updateInvoicePayment]);

  useEffect(() => {
    if (customerId) {
      getInvoices(customerId, ["sent"]);
    }
  }, [getInvoices, customerId]);

  const summary = useMemo(() => {
    // console.log({ paymentId, selectedInvoices });

    const payments = selectedInvoices.reduce((prev, current) => {
      const invoicePayments = current.payments;
      // console.log({ payments, current });
      const paid = invoicePayments[paymentId]?.amount || 0;
      // console.log({ payments, paid });

      return prev + paid;
    }, 0);

    const { amount } = formValues;
    const balance = amount - payments;

    const excess = balance > 0 ? balance : 0;

    return {
      payments,
      excess,
      amount,
    };
  }, [selectedInvoices, formValues, paymentId]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...current, ...data }));
  }

  function finish() {
    const paidInvoices = selectedInvoices.filter((invoice) => {
      const { payments } = invoice;
      return payments[paymentId];
    });
    // console.log({ selectedInvoices, paidInvoices });

    const allData = {
      paymentId,
      ...formValues,
      paidInvoices,
      summary,
    };

    // console.log({ allData });
    saveData(allData);
  }

  function editInvoicePayment(data) {
    setSelectedInvoices((currentInvoices) => {
      // console.log({ data });
      const { invoiceId } = data;

      //get current invoice
      const invoice = currentInvoices.find(
        (invoice) => invoice.invoiceId === invoiceId
      );

      const updated = updateInvoicePayment(invoice, data);

      return currentInvoices.map((currentInvoice) => {
        if (currentInvoice.invoiceId === invoiceId) {
          return {
            ...currentInvoice,
            ...updated,
          };
        } else {
          return currentInvoice;
        }
      });
    });
  }

  function autoPay() {
    let balance = summary.amount;

    const updated = selectedInvoices.map((invoice) => {
      //get similar payment
      const currentPayment = invoice.payments[paymentId]?.amount || 0;
      const invoiceBalance = invoice.summary.balance + currentPayment;
      let latestPayment = 0;

      if (balance > 0) {
        if (balance >= invoiceBalance) {
          latestPayment = invoiceBalance;
          balance = balance - invoiceBalance;
        } else {
          latestPayment = balance;
          balance = 0;
        }
      }

      const paymentData = {
        amount: latestPayment,
      };
      // console.log({ paymentData });

      const updatedInvoice = updateInvoicePayment(invoice, paymentData);

      return updatedInvoice;
    });

    setSelectedInvoices(updated);
  }

  // console.log({ summary, invoices, selectedInvoices });

  return (
    <PaymentsContext.Provider
      value={{
        updating,
        paymentId,
        loadingInvoices: loading && action === GET_CUSTOMER_INVOICES,
        invoices: selectedInvoices,
        getInvoices,
        autoPay,
        editInvoicePayment,
        summary,
        formValues,
        updateFormValues,
        finish,
        accounts,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  paymentId: PropTypes.string.isRequired,
  saveData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { loading, action, invoices } = state.invoicesReducer;
  const { accounts } = state.accountsReducer;

  return { loading, action, invoices, accounts };
}

function mapDispatchToProps(dispatch) {
  return {
    getInvoices: (customerId, statuses) =>
      dispatch({
        type: GET_CUSTOMER_INVOICES,
        payload: { customerId, statuses },
      }),
  };
}

export const PaymentsContextProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Provider);
