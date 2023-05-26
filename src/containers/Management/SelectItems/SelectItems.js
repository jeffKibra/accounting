import { useState, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { GET_VEHICLES } from '../store/actions/itemsActions';
import { GET_PAYMENT_TERMS } from '../store/actions/paymentTermsActions';

import SkeletonLoader from '../components/ui/SkeletonLoader';
import Empty from '../components/ui/Empty';

import InvoiceItemsForm from '../../../components/forms/Invoice/InvoiceItemsForm';

function SelectItems(props) {
  const {
    saveData,
    invoice,
    items,
    loadingItems,
    itemsAction,
    getVehicles,
    updating,
    getPaymentTerms,
    paymentTerms,
    loadingPaymentTerms,
  } = props;

  // console.log({ invoice, customers, items });
  // console.log({ props });
  useEffect(() => {
    getVehicles();
    getPaymentTerms();
  }, [getVehicles, getPaymentTerms]);

  const [addedItems, setAddedItems] = useState(
    invoice?.selectedItems ? [...invoice.selectedItems] : []
  );
  const [remainingItems, setRemainingItems] = useState(items ? [...items] : []);

  const selectedItems = useMemo(() => {
    function deriveData(data) {
      // console.log({ data });
      const { vehicleId, rate, quantity, discount, discountType } = data;
      const item = items.find(item => item.vehicleId === vehicleId);
      let itemRate = rate;
      let itemTax = 0;
      let itemDiscount = discount;

      const { salesTax, salesTaxType } = item;

      //set all rates to be tax exclusive
      if (salesTax?.rate) {
        if (salesTaxType === 'tax inclusive') {
          //item rate is inclusive of tax
          const tax = (salesTax.rate / (100 + salesTax.rate)) * rate;
          itemRate = rate - tax;
        }
      }

      //discounts
      if (discount > 0) {
        if (discountType === 'KES') {
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
        vehicleId,
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
      ? addedItems.map(item => {
          return deriveData(item);
        })
      : addedItems;
  }, [addedItems, items]);

  // console.log({ selectedItems, shipping, adjustment });
  //remove selected items from list
  useEffect(() => {
    let remaining = [];

    if (items) {
      remaining = items.filter(item => {
        const addedItem = addedItems.find(
          ({ vehicleId }) => vehicleId === item.vehicleId
        );
        return !addedItem;
      });
    }

    setRemainingItems(remaining);
  }, [items, addedItems, setRemainingItems]);

  const summary = useMemo(() => {
    let taxes = [];
    selectedItems.forEach(item => {
      const index = taxes.findIndex(tax => tax.taxId === item.salesTax?.taxId);

      if (index === -1) {
        taxes.push(item.salesTax);
      }
    });

    taxes = taxes
      .filter(tax => tax?.name)
      .map(tax => {
        const { taxId } = tax;
        //get all items with this tax
        let totalTax = selectedItems
          .filter(obj => obj.salesTax.taxId === taxId)
          .reduce((sum, item) => {
            return sum + item.totalTax;
          }, 0);
        totalTax = +totalTax.toFixed(2);

        return { ...tax, totalTax };
      });

    const totalTax = taxes.reduce((sum, taxGroup) => {
      return sum + taxGroup.totalTax;
    }, 0);

    const subTotal = selectedItems.reduce((sum, item) => {
      return sum + item.totalAmount;
    }, 0);

    return {
      taxes,
      subTotal: +subTotal.toFixed(2),
      totalTax: +totalTax.toFixed(2),
    };
  }, [selectedItems]);

  function addItem(itemData) {
    const { vehicleId } = itemData;
    setAddedItems(current => {
      const index = current.findIndex(item => item.vehicleId === vehicleId);
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

  function removeItem(vehicleId) {
    // console.log({ vehicleId });
    setAddedItems(current => {
      return current.filter(item => item.vehicleId !== vehicleId);
    });
  }

  function finish(invoiceSummary) {
    const all = {
      summary: invoiceSummary,
      selectedItems,
    };
    // console.log({ invoiceSummary, all });

    saveData(all);
  }

  // console.log({ selectedItems });
  // console.log({ formValues });

  return (loadingItems && itemsAction === GET_VEHICLES) ||
    loadingPaymentTerms ? (
    <SkeletonLoader />
  ) : items?.length > 0 && paymentTerms?.length > 0 ? (
    <InvoiceItemsForm
      summary={summary}
      removeItem={removeItem}
      addItem={addItem}
      finish={finish}
      items={remainingItems}
      selectedItems={selectedItems}
      loading={updating}
      paymentTerms={paymentTerms}
    />
  ) : (
    <Empty message="Please ADD atleast one ITEM to continue or reload the page" />
  );
}

SelectItems.propTypes = {
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
  }),
};

function mapStateToProps(state) {
  const { loading: loadingItems, items, itemsAction } = state.vehiclesReducer;
  const {
    loading: lpt,
    paymentTerms,
    action: ptAction,
  } = state.paymentTermsReducer;
  const loadingPaymentTerms = lpt && ptAction === GET_PAYMENT_TERMS;

  return {
    loadingItems,
    items,
    itemsAction,
    loadingPaymentTerms,
    paymentTerms,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getVehicles: () => dispatch({ type: GET_VEHICLES }),
    getPaymentTerms: () => dispatch({ type: GET_PAYMENT_TERMS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectItems);
