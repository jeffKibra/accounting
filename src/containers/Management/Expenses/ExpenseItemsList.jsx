import { useState, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

import ExpenseItems from "../../../components/Custom/Expenses/ExpenseItems";

function ExpenseItemsList(props) {
  const { defaultValues, taxes, loading, updateFormValues } = props;

  const [items, setItems] = useState(
    defaultValues?.items ? [...defaultValues.items] : []
  );
  const [taxType, setTaxType] = useState(
    defaultValues?.taxType || "taxInclusive"
  );

  const deriveItemData = useCallback(
    (item) => {
      // console.log({ data });
      const { amount, tax } = item;
      let itemRate = amount;
      let itemTax = 0;
      /**
       * set all rates to be tax exclusive
       */
      if (tax?.rate) {
        if (taxType === "taxInclusive") {
          console.log({ taxType });
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
      console.log({ itemRate });

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
      const index = expenseTaxes.findIndex(
        (tax) => tax.taxId === item.tax?.taxId
      );

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
          .filter((item) => item.tax?.taxId === taxId)
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
      taxType,
    };
    // console.log({  all });
    updateFormValues(all);
  }

  return (
    <ExpenseItems
      summary={summary}
      removeItem={removeItem}
      updateItem={updateItem}
      addItem={addItem}
      finish={finish}
      items={items}
      taxes={taxes || []}
      loading={loading}
      setTaxType={setTaxType}
      taxType={taxType}
    />
  );
}

ExpenseItemsList.propTypes = {
  loading: PropTypes.bool.isRequired,
  updateFormValues: PropTypes.func.isRequired,
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
  taxes: PropTypes.array,
};

export default ExpenseItemsList;
