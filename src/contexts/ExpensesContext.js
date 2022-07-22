import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_TAXES } from "../store/actions/taxesActions";

import SkeletonLoader from "../components/ui/SkeletonLoader";

const initialState = {
  summary: {
    taxes: [],
    subTotal: 0,
    totalTaxes: 0,
    totalAmount: 0,
  },
  removeItem: () => {},
  addItem: () => {},
  updateItem: () => {},
  finish: () => {},
  taxes: [],
  items: [],
  loading: false,
  updateFormValues: () => {},
};

const ExpensesContext = createContext(initialState);
ExpensesContext.displayName = "expenses_context";

export default ExpensesContext;

function Provider(props) {
  const {
    children,
    defaultValues,
    taxes,
    loadingTaxes,
    getTaxes,
    updating,
    updateFormValues,
  } = props;

  console.log({ taxes });
  // console.log({ props });

  useEffect(() => {
    getTaxes();
  }, [getTaxes]);

  const [items, setItems] = useState(
    defaultValues?.items ? [...defaultValues.items] : []
  );

  const { taxType } = defaultValues;

  const deriveItemData = useCallback(
    (item) => {
      // console.log({ data });
      const { amount, tax } = item;
      let itemRate = amount;
      let itemTax = 0;
      console.log({ taxType });
      /**
       * set all rates to be tax exclusive
       */
      if (tax?.rate) {
        if (taxType === "taxInclusive") {
          /**
           * item rate is inclusive of tax
           * compute final tax and adjust itemRate accordingly
           */
          itemTax = (tax.rate / (100 + tax.rate)) * itemRate;
          itemRate = itemRate - itemTax;
        } else {
          /**
           * item rate is exclusive of tax
           * compute final tax
           */
          itemTax = (tax.rate / 100) * itemRate;
        }
      }

      const itemData = {
        ...item,
        itemRate: +itemRate.toFixed(2),
        itemTax: +itemTax.toFixed(2),
      };
      // console.log({ itemData });

      return itemData;
    },
    [taxType]
  );
  /**
   * update all items when tax type changes
   * since deriveItemData has taxType as a dependecy, no need to add it here
   */
  useEffect(() => {
    setItems((currentItems) => {
      return currentItems.map((item) => {
        return deriveItemData(item);
      });
    });
  }, [setItems, deriveItemData]);
  /**
   * generate summary
   */
  const summary = useMemo(() => {
    let expenseTaxes = [];
    items.forEach((item) => {
      const index = expenseTaxes.findIndex((tax) => tax.taxId === item.taxId);

      if (index === -1) {
        expenseTaxes.push(item.tax);
      }
    });

    expenseTaxes = expenseTaxes
      .filter((tax) => tax?.name)
      .map((tax) => {
        const { taxId } = tax;
        //get all items with this tax
        let totalTax = items
          .filter((item) => item.taxId === taxId)
          .reduce((sum, item) => {
            return sum + item.itemTax;
          }, 0);
        totalTax = +totalTax.toFixed(2);

        return { ...tax, totalTax };
      });

    const totalTaxes = expenseTaxes.reduce((sum, taxGroup) => {
      return sum + taxGroup.totalTax;
    }, 0);

    const subTotal = items.reduce((sum, item) => {
      return sum + item.amount;
    }, 0);

    const totalAmount =
      taxType === "taxInclusive" ? subTotal : subTotal + +totalTaxes;

    return {
      expenseTaxes,
      subTotal: +subTotal.toFixed(2),
      totalTaxes: +totalTaxes.toFixed(2),
      totalAmount: +totalAmount.toFixed(2),
    };
  }, [items, taxType]);

  function addItem(data) {
    setItems((current) => {
      const itemData = deriveItemData(data);

      return [...current, itemData];
    });
  }

  function updateItem(itemData, index) {
    setItems((current) => {
      current[index] = deriveItemData(itemData);

      return [...current];
    });
  }

  function removeItem(index) {
    setItems((current) => {
      current.splice(index, 1);

      return [...current];
    });
  }

  function finish() {
    const all = {
      items,
      summary,
    };
    // console.log({  all });
    updateFormValues(all);
  }

  return loadingTaxes ? (
    <SkeletonLoader />
  ) : (
    <ExpensesContext.Provider
      value={{
        summary,
        removeItem,
        updateItem,
        addItem,
        finish,
        items,
        taxes: taxes || [],
        loading: updating,
        updateFormValues,
      }}
    >
      {children}
    </ExpensesContext.Provider>
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
    items: PropTypes.array,
    customerId: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  let {
    loading: loadingTaxes,
    taxes,
    action: taxesAction,
  } = state.taxesReducer;
  loadingTaxes = loadingTaxes && taxesAction === GET_TAXES;

  return {
    loadingTaxes,
    taxes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTaxes: () => dispatch({ type: GET_TAXES }),
  };
}

export const ExpensesContextProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Provider);
