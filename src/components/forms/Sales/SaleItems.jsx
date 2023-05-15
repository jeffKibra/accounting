import { useMemo, useEffect } from 'react';
import { VStack, Grid, GridItem } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import PropTypes from 'prop-types';
//utils
import { getSaleSummary } from 'utils/sales';

import LineItems from './LineItems';
//tables
import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';

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
  const { loading, taxes } = props;
  const { watch } = useFormContext();

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

    const selectedItemsObject = selectedItems.reduce((summary, itemDetails) => {
      const { item } = itemDetails;
      if (item) {
        return {
          ...summary,
          [item.itemId]: itemDetails,
        };
      } else {
        return summary;
      }
    }, {});

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

  return (
    <VStack mt={1}>
      {/* {selectSalesType ? (
        <Box my={3} width="100%">
          <FormControl display="flex" alignItems="center">
            <FormLabel margin="0" paddingRight="20px">
              Sale Type:
            </FormLabel>

            <Box width="140px">
              <Controller
                name="saleType"
                control={control}
                render={({ field: { name, value, onChange, onBlur } }) => {
                  return (
                    <ControlledSelect
                      id={name}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder="Sale Type"
                      allowClearSelection={false}
                      options={saleTypes.map(type => {
                        return {
                          name: type,
                          value: type,
                        };
                      })}
                      value={value || ''}
                      isDisabled={loading}
                      size="sm"
                    />
                  );
                }}
              />
            </Box>
          </FormControl>
        </Box>
      ) : null} */}

      <LineItems
        loading={loading}
        itemsObject={itemsObject}
        taxesObject={taxesObject}
        selectedItemsObject={selectedItemsObject}
      />

      <Grid w="full" rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[0, 4, 6]}></GridItem>
        <GridItem colSpan={[12, 8, 6]}>
          <SaleSummaryTable loading={loading} summary={summary} />
        </GridItem>
      </Grid>
    </VStack>
  );
}
