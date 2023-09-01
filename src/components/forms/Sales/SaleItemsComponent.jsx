import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  Button,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { RiAddLine } from 'react-icons/ri';
//contexts
//hooks
//utils

//ui components
import CustomSelect from 'components/ui/CustomSelect';
//tables
import SaleItemsTable from 'components/tables/Sales/SaleItemsTable';
import SaleSummaryTable from 'components/tables/Sales/SaleSummaryTable';
//forms
// import LineFields from './LineFields';
import SaleItemModalForm from './SaleItemModalForm';

//-----------------------------------------------------------------------------\
SaleItemsComponent.propTypes = {
  transactionId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  taxesObject: PropTypes.object,
  itemsObject: PropTypes.object.isRequired,
  selectedItemsObject: PropTypes.object.isRequired,
  taxType: PropTypes.string.isRequired,
  summary: PropTypes.object.isRequired,
  handleSaleItemEdit: PropTypes.func.isRequired,
  tableProps: PropTypes.shape({
    selectedItems: PropTypes.array.isRequired,
    removeItem: PropTypes.func.isRequired,
  }),
  saleItemFormProps: PropTypes.shape({
    defaultValues: PropTypes.object,
    handleFormSubmit: PropTypes.func.isRequired,
    handleFormCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
  }),
  // preSelectedItems: PropTypes.array,
};

export default function SaleItemsComponent(props) {
  // console.log({ props });
  const {
    transactionId,
    loading,
    taxesObject,
    itemsObject,
    selectedItemsObject,
    taxType,
    summary,
    tableProps,
    saleItemFormProps,
    handleSaleItemEdit,
  } = props;

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

      <VStack mt={1} w="100%">
        <Flex w="full" justify="flex-end" align="center" flexWrap="wrap">
          <Flex grow={1} h="32px" alignItems="center">
            <Heading size="md" as="h3">
              Items
            </Heading>
          </Flex>

          <Text mr={1} fontSize="sm">
            Amounts are
          </Text>

          <Box w="140px">
            <CustomSelect
              isDisabled={loading}
              size="sm"
              colorScheme="cyan"
              // name="summary.taxType"
              name="taxType"
              options={[
                { name: 'Inclusive of Tax', value: 'taxInclusive' },
                { name: 'Exclusive of Tax', value: 'taxExclusive' },
              ]}
            />
          </Box>
        </Flex>
      </VStack>

      <SaleItemsTable
        {...tableProps}
        handleItemEdit={handleSaleItemEdit}
        taxType={taxType}
        loading={loading}
      />

      <Flex w="full" justifyContent="flex-start">
        <Button
          onClick={() => handleSaleItemEdit(null)}
          size="sm"
          colorScheme="cyan"
          leftIcon={<RiAddLine />}
          disabled={loading}
          mt={4}
        >
          add item
        </Button>
      </Flex>

      <Grid w="full" rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[0, 4, 6]}></GridItem>
        <GridItem colSpan={[12, 8, 6]}>
          <SaleSummaryTable loading={loading} summary={summary} />
        </GridItem>
      </Grid>

      <SaleItemModalForm
        {...saleItemFormProps}
        itemsObject={itemsObject}
        selectedItemsObject={selectedItemsObject}
        taxesObject={taxesObject}
        loading={loading}
        transactionId={transactionId}
      />
    </VStack>
  );
}
