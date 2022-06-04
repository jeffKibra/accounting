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
    totalTaxes: 0,
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
  // console.log({ props });

  useEffect(() => {
    getItems();
    getCustomers();
  }, [getItems, getCustomers]);

  const [formValues, setFormValues] = useState(invoice || null);
  const [selectedItems, setSelectedItems] = useState(
    invoice?.selectedItems || []
  );
  const [shipping, setShipping] = useState(invoice?.summary?.shipping || 0);
  const [adjustment, setAdjustment] = useState(
    invoice?.summary?.adjustment || 0
  );
  // console.log({ selectedItems, shipping, adjustment });
  //remove selected items from list
  const remainingItems = useMemo(() => {
    if (items) {
      return items.filter((item) => {
        const selectedItem = selectedItems.find(
          ({ itemId }) => itemId === item.itemId
        );
        return !selectedItem;
      });
    }

    return [];
  }, [items, selectedItems]);

  const summary = useMemo(() => {
    let taxes = [];
    selectedItems.forEach((item) => {
      const index = taxes.findIndex(
        (tax) => tax.taxId === item.salesTax?.taxId
      );

      if (index === -1) {
        taxes.push(item.salesTax);
      }
    });

    taxes = taxes
      .filter((tax) => tax?.name)
      .map((tax) => {
        const { taxId } = tax;
        //get all items with this tax
        let totalTax = selectedItems
          .filter((obj) => obj.salesTax.taxId === taxId)
          .reduce((prev, current) => {
            const sum = current.totalTax + prev;
            return sum;
          }, 0);
        totalTax = +totalTax.toFixed(2);

        return { ...tax, totalTax };
      });

    const totalTaxes = taxes.reduce((prev, current) => {
      return prev + current.totalTax;
    }, 0);

    const subTotal = selectedItems.reduce((prev, current) => {
      return prev + current.totalAmount;
    }, 0);

    const totalAmount = subTotal + adjustment + shipping;

    return {
      taxes,
      subTotal: +subTotal.toFixed(2),
      totalTaxes: +totalTaxes.toFixed(2),
      adjustment,
      shipping,
      totalAmount: +totalAmount.toFixed(2),
    };
  }, [selectedItems, adjustment, shipping]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...(current ? current : {}), ...data }));
  }

  function addItem(data) {
    // console.log({ data });
    const { itemId, rate, quantity, discount, discountType } = data;
    const item = items.find((item) => item.itemId === itemId);
    let amount = rate * quantity;
    let totalDiscount = 0;
    /**
     * initialize total amount with amount assuming amount is:
     * tax exclusive
     */
    let totalAmount = 0;
    //initialize assuming amount is tax exclusive
    let taxExclusiveAmount = amount;
    let totalTax = 0;
    const { salesTax, salesTaxType } = item;

    //set all values to be tax exclusive
    if (salesTax?.rate) {
      if (salesTaxType === "tax inclusive") {
        //item rate is inclusive of tax
        const tax = (salesTax.rate / (100 + salesTax.rate)) * amount;
        taxExclusiveAmount = amount - tax;
      }
    }

    //discounts
    if (discount > 0) {
      if (discountType === "KES") {
        totalDiscount = discount;
      } else {
        totalDiscount = (discount * taxExclusiveAmount) / 100;
      }
    }
    /**
     * adjust tax exclusive amount based on discount given
     * for uniformity, discounts are applied to the tax exclusive amount
     * ask user to consider giving the discount at transaction level
     * instead of item level
     */
    if (totalDiscount) {
      taxExclusiveAmount -= totalDiscount;
    }

    //assing taxes
    if (salesTax?.rate) {
      //item rate does not have tax
      totalTax = (salesTax.rate / 100) * taxExclusiveAmount;
    }
    //finaly assign total amount
    totalAmount = taxExclusiveAmount + totalTax;

    const itemData = {
      itemId,
      rate,
      quantity,
      discount,
      discountType,
      totalDiscount: +totalDiscount.toFixed(2),
      totalAmount: +totalAmount.toFixed(2),
      taxExclusiveAmount: +taxExclusiveAmount.toFixed(2),
      totalTax: +totalTax.toFixed(2),
    };

    // console.log({ itemData });

    setSelectedItems((current) => {
      const index = current.findIndex((value) => value.itemId === itemId);
      // console.log({ current, index, quantity });
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
    // console.log({ itemId });
    setSelectedItems((current) => {
      return current.filter((item) => item.itemId !== itemId);
    });
  }

  function finish() {
    const all = {
      ...formValues,
      selectedItems,
      summary,
    };
    // console.log({ data, all });

    saveData(all);
  }

  // console.log({ selectedItems });
  console.log({ formValues });

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
        items: remainingItems,
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
    invoiceDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
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
