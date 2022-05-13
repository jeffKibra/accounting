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
PaymentsContext.displayName = "payments_context";

export default PaymentsContext;

function Provider(props) {
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
  const { customerId } = formValues;

  const updateInvoicePayment = useCallback(
    (invoice = {}, data = { amount: 0, withholdingTax: 0 }) => {
      /**
       * function is to be called after ascertaining no conflicts in summary amount
       */
      const { invoiceId } = invoice;
      const { amount } = data;
      const { tdsTaxAccount } = formValues;
      const paymentData = {
        ...data,
        paymentId,
        invoiceId,
        ...(tdsTaxAccount ? { tdsTaxAccount } : {}),
      };

      let payments = [...invoice.payments];
      const index = payments.findIndex(
        (payment) => payment.paymentId === paymentId
      );

      console.log({ paymentData, payments });

      if (index === -1) {
        //create new payment entry
        if (amount > 0) {
          //only add amounts greater than zero
          payments = [{ ...paymentData }, ...payments];
        }
      } else {
        //create new payments with current payment updated to supplied amount
        if (amount > 0) {
          //only update amounts greater than zero
          payments = payments.map((payment) => {
            if (payment.paymentId === paymentId) {
              console.log({ payment, paymentData });
              return {
                ...payment,
                ...paymentData,
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
      // console.log({ invoiceTotal, totalPaid, newBalance });

      return {
        ...invoice,
        payments,
        summary: {
          ...invoice.summary,
          balance: newBalance,
        },
      };
    },
    [formValues, paymentId]
  );

  useEffect(() => {
    //update selected invoices incase invoices change
    if (invoices) {
      setSelectedInvoices(invoices);
    }
  }, [invoices]);

  useEffect(() => {
    const { amount } = formValues;
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
  }, [formValues, updateInvoicePayment]);

  useEffect(() => {
    if (customerId) {
      getInvoices(customerId, ["sent"]);
    }
  }, [getInvoices, customerId]);

  const summary = useMemo(() => {
    // console.log({ paymentId, selectedInvoices });

    const paidAmount = selectedInvoices.reduce((prev, current) => {
      const payments = current.payments;
      // console.log({ payments, current });
      const paid =
        payments.find((payment) => payment.paymentId === paymentId)?.amount ||
        0;
      // console.log({ payments, paid });

      return prev + paid;
    }, 0);

    const { amount } = formValues;
    const balance = amount - paidAmount;

    const excess = balance > 0 ? balance : 0;

    return {
      paidAmount,
      excess,
      amount,
    };
  }, [selectedInvoices, formValues, paymentId]);

  function updateFormValues(data) {
    // console.log({ data });
    setFormValues((current) => ({ ...current, ...data }));
  }

  function finish() {
    const paidInvoices = selectedInvoices.filter((invoice) => {
      const { payments } = invoice;
      return payments.find((payment) => payment.paymentId === paymentId);
    });
    console.log({ selectedInvoices, paidInvoices });

    const allData = {
      ...formValues,
      paidInvoices,
      summary,
    };

    console.log({ allData });
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
          // console.log("invoice found");
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

  function getSimilarPayment(invoice) {
    const { payments } = invoice;
    return payments.find((payment) => payment.paymentId === paymentId);
  }

  function autoPay() {
    let balance = summary.amount;

    const updated = selectedInvoices.map((invoice) => {
      //get similar payment
      const currentPayment = getSimilarPayment(invoice)?.amount || 0;
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

      const updatedInvoice = updateInvoicePayment(invoice, paymentData);

      return updatedInvoice;
    });

    setSelectedInvoices(updated);
  }

  // console.log({ summary, invoices, selectedInvoices });

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

Provider.propTypes = {
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

export const PaymentsContextProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Provider);
