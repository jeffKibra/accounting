import { useMemo, useEffect, useState, useCallback } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import PropTypes from 'prop-types';
//utils
import { getSaleSummary } from 'utils/sales';
//hooks
import { useToasts } from 'hooks';

import SaleItemsComponent from './SaleItemsComponent';
//----------------------------------------------------------------
// const saleTypes = ['normal', 'booking'];
//--------------------------------------------------------------------------------
SaleItems.propTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  taxes: PropTypes.array.isRequired,
  selectSalesType: PropTypes.bool,
  // preSelectedItems: PropTypes.array,
};

export default function SaleItems(props) {
  const { loading, taxes, transactionId } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();

  const toasts = useToasts();

  const { watch, control, getValues, setValue } = useFormContext();

  //taxes object
  const taxesObject = useMemo(() => {
    return taxes.reduce((obj, tax) => {
      const { name, rate, taxId } = tax;
      return {
        ...obj,
        [taxId]: { name, rate, taxId },
      };
    }, {});
  }, [taxes]);
  //form methhods

  useEffect(() => {
    console.log('mounting');

    return () => console.log('unmounting');
  }, []);

  // useEffect(() => {
  //   /**
  //    * add default selectedItems
  //    */
  //   console.log('updating default selectedItems');
  //   if (
  //     preSelectedItems &&
  //     Array.isArray(preSelectedItems) &&
  //     preSelectedItems.length > 0
  //   ) {
  //     // replace(preSelectedItems);
  //     // preSelectedItems.forEach(item => {
  //     //   append({ ...item });
  //     // });
  //   } else {
  //     // append({
  //     //   item: null,
  //     //   rate: 0,
  //     //   quantity: 0,
  //     //   itemRate: 0,
  //     //   itemTax: 0,
  //     //   itemRateTotal: 0,
  //     //   itemTaxTotal: 0,
  //     //   salesTax: null,
  //     // });
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const taxType = watch('taxType');
  const itemsFields = watch('selectedItems');

  /**
   * using watch makes selecetd items(fields) to change on every render.
   * to avoid performance issues, convert formItems into a JSON string
   * useMemo and useEffect with be able to compare strings appropriately
   * and only rerender when value changes
   */
  const fieldsString = JSON.stringify(itemsFields || []);
  //compute summary values whenever selected items change
  const { summary, selectedItemsObject } = useMemo(() => {
    /**
     * parse the json string to get back field values
     */
    const selectedItems = JSON.parse(fieldsString);

    const selectedItemsObject = {};
    selectedItems.forEach(saleItem => {
      const { item } = saleItem;
      const itemId = item?.itemId;
      if (itemId) {
        selectedItemsObject[itemId] = saleItem;
      }
    });

    console.log('generating summary');
    const summary = getSaleSummary(selectedItems);

    return { selectedItemsObject, summary };
  }, [fieldsString]);
  // console.log({ summary, selectedItemsObject });
  /**
   * convert items into an object for easier updates .
   * helps to avoid iterating the whole array for every update
   */
  const itemsObject = useMemo(() => {
    const items = props.items;
    let itemsObject = {};

    if (items && Array.isArray(items)) {
      itemsObject = items.reduce((obj, item) => {
        const { itemId } = item;
        return {
          ...obj,
          [itemId]: { ...item },
        };
      }, {});
    }

    return itemsObject;
  }, [props.items]);

  // console.log({ fields, errors });

  // console.log({ errors });

  const { remove, append } = useFieldArray({
    name: 'selectedItems',
    control,
    // shouldUnregister: true,
  });
  // console.log({
  //   fields,
  //   slItems: watch('selectedItems'),
  //   customer: watch('customer'),
  // });

  const [editIndex, setEditIndex] = useState(0);
  const [formDefaultValues, setFormDefaultValues] = useState(null);
  // console.log({ formDefaultValues });
  const isAddingNewItem = !Boolean(formDefaultValues);

  const addNewLine = useCallback(
    data => {
      console.log('adding new line');
      append(data);
      // append({
      //   item: null,
      //   rate: 0,
      //   startDate: new Date(),
      //   endDate: new Date(),
      //   quantity: 0,
      //   itemRate: 0,
      //   itemTax: 0,
      //   itemRateTotal: 0,
      //   itemTaxTotal: 0,
      //   salesTax: null,
      // });
    },
    [append]
  );

  // console.log({ fields, errors });

  const removeItem = useCallback(
    index => {
      //fetch item from list using the index
      const item = getValues(`selectedItems.${index}`);
      // console.log({ item, index });

      if (item && typeof item === 'object') {
        //remove it from form
        remove(index);
      } else {
        //item is undefined
        toasts.error(`Item at Index ${index} not found`);
      }
    },
    [remove, getValues, toasts]
  );

  const handleItemUpdate = useCallback(
    (data, index) => {
      try {
        console.log('updating item', { data, index });
        const fieldId = `selectedItems.${index}`;
        // console.log({ currentValues });

        // console.log({ updatedValues });
        //update item
        setValue(fieldId, data);
      } catch (error) {
        console.error(error);
        toasts.error(
          `Error update form fields: ${error?.message || 'Unknown Error!'}`
        );
      }
    },
    [setValue, toasts]
  );

  // console.log({ errors });

  const handleSaleItemEdit = useCallback(
    (data, index) => {
      console.log({ data, index });
      setFormDefaultValues(data);
      setEditIndex(index);
      //openModal
      onOpen();
    },
    [onOpen, setFormDefaultValues, setEditIndex]
  );

  const handleFormCancel = useCallback(() => {
    onClose();
    setFormDefaultValues(null);
  }, [onClose, setFormDefaultValues]);

  const handleFormSubmit = useCallback(
    data => {
      console.log('submitted data', { data });
      //submit data first
      if (isAddingNewItem) {
        addNewLine(data);
      } else {
        //update item
        handleItemUpdate(data, editIndex);
      }
      handleFormCancel();
    },
    [addNewLine, handleItemUpdate, handleFormCancel, isAddingNewItem, editIndex]
  );

  // console.log({ fields, itemsFields });

  return (
    <SaleItemsComponent
      transactionId={transactionId}
      handleSaleItemEdit={handleSaleItemEdit}
      itemsObject={itemsObject}
      loading={loading}
      selectedItemsObject={selectedItemsObject}
      summary={summary}
      taxType={taxType}
      taxesObject={taxesObject}
      tableProps={{
        handleItemDelete: removeItem,
        items: itemsFields,
      }}
      saleItemFormProps={{
        handleFormCancel,
        handleFormSubmit,
        isOpen,
        defaultValues: formDefaultValues,
      }}
    />
  );
}
