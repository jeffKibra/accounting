import { createContext, useState, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_ITEMS } from "../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../store/actions/customersActions";

import SkeletonLoader from "../components/ui/SkeletonLoader";
import Empty from "../components/ui/Empty";

const initialState = {
  summary: {
    taxes: [],
    subTotal: 0,
    totalTax: 0,
    adjustment: 0,
    shipping: 0,
    totalAmount: 0,
    balance: 0,
  },
  setShipping: () => {},
  setAdjustment: () => {},
  removeItem: () => {},
  addItem: () => {},
  finish: () => {},
  items: [],
  customers: [],
  selectedItems: [],
  loading: false,
  formValues: {},
  updateFormValues: () => {},
};

const InvoicesContext = createContext(initialState);
InvoicesContext.displayName = "invoices_context";

export default InvoicesContext;

function Provider(props) {
  const {
    children,
    saveData,
    invoice,
    items,
    loadingItems,
    itemsAction,
    loadingCustomers,
    customers,
    customersAction,
    getItems,
    getCustomers,
    updating,
  } = props;

  //   console.log({ invoice, customers });
  console.log({ props });

  useEffect(() => {
    getItems();
    getCustomers();
  }, [getItems, getCustomers]);

  const [formValues, setFormValues] = useState(invoice || {});
  const [selectedItems, setSelectedItems] = useState(
    invoice?.selectedItems || []
  );
  const [shipping, setShipping] = useState(invoice?.summary?.shipping || 0);
  const [adjustment, setAdjustment] = useState(
    invoice?.summary?.adjustment || 0
  );
  console.log({ selectedItems, shipping, adjustment });

  const summary = useMemo(() => {
    let taxes = [];
    selectedItems.forEach((item) => {
      const index = taxes.findIndex((tax) => tax.taxId === item.tax?.taxId);

      if (index === -1) {
        taxes.push(item.tax);
      }
    });
    console.log({ taxes });

    taxes = taxes
      .filter((tax) => tax?.name)
      .map((tax) => {
        const { taxId, rate } = tax;
        console.log({ rate });
        //get all items with this tax
        const totalAmount = selectedItems
          .filter((obj) => obj.tax.taxId === taxId)
          .reduce((prev, current) => {
            const { amount } = current;
            return amount + prev;
          }, 0);

        const taxedAmount = Math.ceil((totalAmount * rate) / 100);

        console.log({ taxedAmount });
        console.log({ tax });

        return { ...tax, taxedAmount };
      });

    const totalTax = taxes.reduce((prev, current) => {
      const { taxedAmount } = current;
      return prev + taxedAmount;
    }, 0);

    const subTotal = selectedItems.reduce((prev, current) => {
      const { amount } = current;
      return prev + amount;
    }, 0);

    const totalAmount = subTotal + totalTax + adjustment + shipping;

    return {
      taxes,
      subTotal,
      totalTax,
      adjustment,
      shipping,
      totalAmount,
      balance: totalAmount,
    };
  }, [selectedItems, adjustment, shipping]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...current, ...data }));
  }

  function addItem(data) {
    console.log({ data });
    const { itemId, rate, quantity, discount, discountType } = data;
    const item = items.find((item) => item.itemId === itemId);
    let amount = rate * quantity;
    let totalDiscount = 0;

    if (discount > 0) {
      if (discountType === "KES") {
        totalDiscount = discount;
      } else {
        totalDiscount = Math.floor((discount * amount) / 100);
      }
    }

    console.log({ amount, totalDiscount });

    amount = amount - totalDiscount;

    const itemData = {
      itemId,
      rate,
      quantity,
      discount,
      discountType,
      totalDiscount,
      amount,
    };

    setSelectedItems((current) => {
      const index = current.findIndex((value) => value.itemId === itemId);
      console.log({ current, index, quantity });
      let newItems = [];

      if (index === -1) {
        //value not in selected array
        newItems = [...current, { ...item, ...itemData }];
      } else {
        //value is in the selected array
        newItems = current.map((value, i) => {
          if (i === index) {
            return {
              ...value,
              ...itemData,
            };
          } else {
            return value;
          }
        });
      }

      return newItems;
    });
  }

  function removeItem(itemId) {
    console.log({ itemId });
    setSelectedItems((current) => {
      return current.filter((item) => item.itemId !== itemId);
    });
  }

  function finish(data) {
    updateFormValues(data);
    const all = {
      ...data,
      selectedItems,
      summary,
    };
    console.log({ data, all });

    saveData(all);
  }

  console.log({ selectedItems });

  return (loadingItems && itemsAction === GET_ITEMS) ||
    (loadingCustomers && customersAction === GET_CUSTOMERS) ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && items?.length > 0 ? (
    <InvoicesContext.Provider
      value={{
        summary,
        setShipping,
        setAdjustment,
        removeItem,
        addItem,
        finish,
        items,
        customers,
        selectedItems,
        loading: updating,
        formValues,
        updateFormValues,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  ) : (
    <Empty message="Please add atleast one CUSTOMER and one ITEM to continue or reload the page" />
  );
}

Provider.propTypes = {
  updating: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  invoice: PropTypes.shape({
    summary: PropTypes.shape({
      shipping: PropTypes.number,
      adjustment: PropTypes.number,
      totalTax: PropTypes.number,
      totalAmount: PropTypes.number,
      subTotal: PropTypes.number,
      taxes: PropTypes.array,
    }),
    selectedItems: PropTypes.array,
    customerId: PropTypes.string,
    invoiceDate: PropTypes.string,
    dueDate: PropTypes.string,
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    invoiceSlug: PropTypes.string,
    invoiceId: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading: loadingItems, items, itemsAction } = state.itemsReducer;
  const {
    loading: loadingCustomers,
    customers,
    action: customersAction,
  } = state.customersReducer;

  return {
    loadingItems,
    items,
    itemsAction,
    loadingCustomers,
    customers,
    customersAction,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
  };
}

export const InvoicesContextProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Provider);
