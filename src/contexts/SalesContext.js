import { createContext, useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

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
    customers,
    updating,
    paymentTerms,
    loading,
  } = props;

  // console.log({ paymentTerms customers, items });
  // console.log({ props });

  const [formValues, setFormValues] = useState(
    defaultValues ? { ...defaultValues } : null
  );
  const [addedItems, setAddedItems] = useState(
    defaultValues?.selectedItems ? [...defaultValues.selectedItems] : []
  );
  const [remainingItems, setRemainingItems] = useState(items ? [...items] : []);

  const selectedItems = useMemo(() => {
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

  return loading ? (
    <SkeletonLoader />
  ) : items?.length > 0 && paymentTerms?.length > 0 ? (
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
  items: PropTypes.array.isRequired,
  customers: PropTypes.array.isRequired,
  paymentTerms: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
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

export const SalesContextProvider = Provider;
