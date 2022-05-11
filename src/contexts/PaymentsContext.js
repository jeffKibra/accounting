import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { GET_CUSTOMER_INVOICES } from "../store/actions/invoicesActions";

const initialState = {
  paymentId: "",
  loadingInvoices: false,
  invoices: [],
  getInvoices: () => {},
  autoPay: () => {},
  editInvoicePayment: () => {},
  summary: { paidAmount: 0, excess: 0, amount: 0 },
  formValues: {},
  updateFormValues: () => {},
  finish: () => {},
};

const PaymentsContext = createContext({ ...initialState });
PaymentsContext.name = "payments_context";

export default PaymentsContext;

function PaymentsContextProvider(props) {
  const {
    children,
    paymentId,
    defaultValues,
    saveData,
    loading,
    action,
    invoices,
    getInvoices,
  } = props;

  const [selectedInvoices, setSelectedInvoices] = useState(invoices || []);
  const [formValues, setFormValues] = useState(defaultValues || {});
  const { amount, customerId } = formValues;

  useEffect(() => {
    //update selected invoices incase invoices change
    if (invoices) {
      setSelectedInvoices(invoices);
    }
  }, [invoices]);

  useEffect(() => {
    if (customerId) {
      getInvoices(customerId, ["sent"]);
    }
  }, [getInvoices, customerId]);

  const summary = useMemo(() => {
    console.log({ paymentId, selectedInvoices });

    const paidAmount = selectedInvoices.reduce((prev, current) => {
      const payments = current.payments;
      console.log({ payments, current });
      const paid =
        payments.find((payment) => payment.paymentId === paymentId)?.amount ||
        0;
      console.log({ payments, paid });

      return prev + paid;
    }, 0);

    const balance = amount - paidAmount;

    const excess = balance > 0 ? balance : 0;

    return {
      paidAmount,
      excess,
      amount,
    };
  }, [selectedInvoices, amount, paymentId]);

  function updateFormValues(data) {
    console.log({ data });
    setFormValues((current) => ({ ...current, ...data }));
  }

  function finish() {
    saveData({});
  }

  function updateInvoicePayment(invoice = {}, amount = 0) {
    /**
     * function is to be called after ascertaining no conflicts in summary amount
     */

    let payments = [...invoice.payments];
    const index = payments.findIndex(
      (payment) => payment.paymentId === paymentId
    );

    if (index === -1) {
      //create new payment entry
      if (amount > 0) {
        //only add amounts greater than zero
        payments = [{ paymentId, amount }, ...payments];
      }
    } else {
      //create new payments with current payment updated to supplied amount
      if (amount > 0) {
        //only update amounts greater than zero
        payments = payments.map((payment) => {
          if (payment.paymentId === paymentId) {
            return {
              ...payment,
              amount,
            };
          }
          return payment;
        });
      } else {
        //amount is zero, remove payment from list
        payments = payments.filter(
          (payment) => payment.paymentId !== paymentId
        );
      }
    }

    const totalPaid = payments.reduce((prev, payment) => {
      return prev + payment.amount;
    }, 0);

    const invoiceTotal = invoice.summary.totalAmount;
    const newBalance = invoiceTotal - totalPaid;
    console.log({ invoiceTotal, totalPaid, newBalance });

    return {
      ...invoice,
      payments,
      summary: {
        ...invoice.summary,
        balance: newBalance,
      },
    };
  }

  function editInvoicePayment(data) {
    setSelectedInvoices((currentInvoices) => {
      console.log({ data });
      const { invoiceId, amount } = data;

      //get current invoice
      const invoice = currentInvoices.find(
        (invoice) => invoice.invoiceId === invoiceId
      );

      const updated = updateInvoicePayment(invoice, amount);
      console.log({ updated });

      return currentInvoices.map((currentInvoice) => {
        if (currentInvoice.invoiceId === invoiceId) {
          console.log("invoice found");
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

    const updated = invoices.map((invoice) => {
      const invoiceBalance = invoice.summary.balance;
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

      const updatedInvoice = updateInvoicePayment(invoice, latestPayment);

      console.log({ updatedInvoice });

      return updatedInvoice;
    });

    console.log({ updated });

    setSelectedInvoices(updated);
  }

  console.log({ summary, invoices, selectedInvoices });

  return (
    <PaymentsContext.Provider
      value={{
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
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
}

PaymentsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValues: PropTypes.object,
  paymentId: PropTypes.string.isRequired,
  saveData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { loading, action, invoices } = state.invoicesReducer;

  return { loading, action, invoices };
}

function mapDispatchToProps(dispatch) {
  return {
    getInvoices: (customerId, statuses) =>
      dispatch({ type: GET_CUSTOMER_INVOICES, customerId, statuses }),
  };
}

export const Provider = connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentsContextProvider);
