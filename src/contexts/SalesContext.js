import { createContext, useState, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_ITEMS } from "../store/actions/itemsActions";
import { GET_CUSTOMERS } from "../store/actions/customersActions";
import { GET_PAYMENT_TERMS } from "../store/actions/paymentTermsActions";

import SkeletonLoader from "../components/ui/SkeletonLoader";
import Empty from "../components/ui/Empty";

const initialState = {
  summary: {
    taxes: [],
    subTotal: 0,
    totalTaxes: 0,
  },
  removeItem: () => {},
  addItem: () => {},
  finish: () => {},
  items: [],
  customers: [],
  selectedItems: [],
  loading: false,
  formValues: {},
  updateFormValues: () => {},
  paymentTerms: [{ name: "", value: "" }],
};

const SalesContext = createContext(initialState);
SalesContext.displayName = "sales_context";

export default SalesContext;

function Provider(props) {
  const {
    children,
    saveData,
    defaultValues,
    items,
    loadingItems,
    loadingCustomers,
    customers,
    getItems,
    getCustomers,
    updating,
    getPaymentTerms,
    paymentTerms,
    loadingPaymentTerms,
  } = props;

  // console.log({ paymentTerms customers, items });
  // console.log({ props });

  useEffect(() => {
    getItems();
    getCustomers();
    getPaymentTerms();
  }, [getItems, getCustomers, getPaymentTerms]);

  const [formValues, setFormValues] = useState(
    defaultValues ? { ...defaultValues } : null
  );
  const [addedItems, setAddedItems] = useState(
    defaultValues?.selectedItems ? [...defaultValues.selectedItems] : []
  );
  const [remainingItems, setRemainingItems] = useState(items ? [...items] : []);

  const selectedItems = useMemo(() => {
    function deriveData(data) {
      // console.log({ data });
      const { itemId, rate, quantity, discount, discountType } = data;
      const item = items.find((item) => item.itemId === itemId);
      let itemRate = rate;
      let itemTax = 0;
      let itemDiscount = discount;

      const { salesTax, salesTaxType } = item;

      //set all rates to be tax exclusive
      if (salesTax?.rate) {
        if (salesTaxType === "tax inclusive") {
          //item rate is inclusive of tax
          const tax = (salesTax.rate / (100 + salesTax.rate)) * rate;
          itemRate = rate - tax;
        }
      }

      //discounts
      if (discount > 0) {
        if (discountType === "KES") {
          itemDiscount = discount;
        } else {
          itemDiscount = (discount * itemRate) / 100;
        }
      }
      /**
       * adjust item rate based on discount given
       * for uniformity, discounts are applied to the tax exclusive amount
       * ask user to consider giving the discount at transaction level
       * instead of item level
       */
      if (itemDiscount && itemDiscount > 0) {
        itemRate -= itemDiscount;
      }

      //compute final tax after discounts
      if (salesTax?.rate) {
        //item rate does not have tax
        itemTax = (salesTax.rate / 100) * itemRate;
      }
      /**
       * finally compute amounts based on item quantity
       */
      const totalAmount = itemRate * quantity;
      const totalTax = itemTax * quantity;
      const totalDiscount = itemDiscount * quantity;

      const itemData = {
        ...item,
        ...data,
        itemId,
        itemRate: +itemRate.toFixed(2),
        itemTax: +itemTax.toFixed(2),
        itemDiscount: +itemDiscount.toFixed(2),
        totalDiscount: +totalDiscount.toFixed(2),
        totalAmount: +totalAmount.toFixed(2),
        totalTax: +totalTax.toFixed(2),
      };
      // console.log({ itemData });

      return itemData;
    }

    return items
      ? addedItems.map((item) => {
          return deriveData(item);
        })
      : addedItems;
  }, [addedItems, items]);

  // console.log({ selectedItems, shipping, adjustment });
  //remove selected items from list
  useEffect(() => {
    let remaining = [];

    if (items) {
      remaining = items.filter((item) => {
        const addedItem = addedItems.find(
          ({ itemId }) => itemId === item.itemId
        );
        return !addedItem;
      });
    }

    setRemainingItems(remaining);
  }, [items, addedItems, setRemainingItems]);

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
          .reduce((sum, item) => {
            return sum + item.totalTax;
          }, 0);
        totalTax = +totalTax.toFixed(2);

        return { ...tax, totalTax };
      });

    const totalTaxes = taxes.reduce((sum, taxGroup) => {
      return sum + taxGroup.totalTax;
    }, 0);

    const subTotal = selectedItems.reduce((sum, item) => {
      return sum + item.totalAmount;
    }, 0);

    return {
      taxes,
      subTotal: +subTotal.toFixed(2),
      totalTaxes: +totalTaxes.toFixed(2),
    };
  }, [selectedItems]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...(current ? current : {}), ...data }));
  }

  function addItem(itemData) {
    const { itemId } = itemData;
    setAddedItems((current) => {
      const index = current.findIndex((item) => item.itemId === itemId);
      // console.log({ current, index, quantity });
      let newItems = [];

      if (index === -1) {
        //item not in selected array
        newItems = [...current, { ...itemData }];
      } else {
        //item is in the selected array
        newItems = current.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              ...itemData,
            };
          } else {
            return item;
          }
        });
      }

      return newItems;
    });
  }

  function removeItem(itemId) {
    // console.log({ itemId });
    setAddedItems((current) => {
      return current.filter((item) => item.itemId !== itemId);
    });
  }

  function finish(data) {
    updateFormValues({ ...data });
    const all = {
      ...formValues,
      ...data,
      selectedItems,
    };
    // console.log({  all });

    saveData(all);
  }

  // console.log({ selectedItems });
  // console.log({ formValues });

  return loadingItems || loadingCustomers || loadingPaymentTerms ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && items?.length > 0 && paymentTerms?.length > 0 ? (
    <SalesContext.Provider
      value={{
        summary,
        removeItem,
        addItem,
        finish,
        items: remainingItems,
        customers,
        selectedItems,
        loading: updating,
        formValues,
        updateFormValues,
        paymentTerms,
      }}
    >
      {children}
    </SalesContext.Provider>
  ) : (
    <Empty message="Please add atleast one CUSTOMER and one ITEM to continue or reload the page" />
  );
}

Provider.propTypes = {
  updating: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  defaultValues: PropTypes.shape({
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
  }),
};

function mapStateToProps(state) {
  let {
    loading: loadingItems,
    items,
    action: itemsAction,
  } = state.itemsReducer;
  loadingItems = loadingItems && itemsAction === GET_ITEMS;

  let {
    loading: loadingCustomers,
    customers,
    action: customersAction,
  } = state.customersReducer;
  loadingCustomers = loadingCustomers && customersAction === GET_CUSTOMERS;

  let {
    loading: loadingPaymentTerms,
    paymentTerms,
    action: ptAction,
  } = state.paymentTermsReducer;
  loadingPaymentTerms = loadingPaymentTerms && ptAction === GET_PAYMENT_TERMS;

  return {
    loadingItems,
    items,
    loadingCustomers,
    customers,
    loadingPaymentTerms,
    paymentTerms,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getItems: () => dispatch({ type: GET_ITEMS }),
    getCustomers: () => dispatch({ type: GET_CUSTOMERS }),
    getPaymentTerms: () => dispatch({ type: GET_PAYMENT_TERMS }),
  };
}

export const SalesContextProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Provider);
