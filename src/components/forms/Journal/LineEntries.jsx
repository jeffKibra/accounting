import { useMemo, useCallback, useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import {
  Flex,
  VStack,
  Button,
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
//contexts
//hooks
import { useToasts } from 'hooks';
//utils
import { getSaleSummary } from 'utils/sales';

import EntryFields from './EntryFields';
//tables
import JournalSummaryTable from 'components/tables/Journal/SummaryTable';

//-----------------------------------------------------------------------
LineEntries.propTypes = {
  loading: PropTypes.bool.isRequired,
  accounts: PropTypes.array.isRequired,
  taxes: PropTypes.array.isRequired,
  // preentries: PropTypes.array,
  customers: PropTypes.array.isRequired,
};

export default function LineEntries(props) {
  const { loading, taxes, customers, accounts } = props;

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

  //taxes object
  const accountsObject = useMemo(() => {
    return accounts.reduce((obj, account) => {
      const { name, accountType, accountId } = account;
      return {
        ...obj,
        [accountId]: { name, accountType, accountId },
      };
    }, {});
  }, [accounts]);

  //form methhods
  const {
    watch,
    setValue,
    getValues,
    control,
    // formState: { errors },
  } = useFormContext();
  //hooks
  const toasts = useToasts();
  //state
  /**
   * initialize field array for selected items
   */
  const { fields, remove, append } = useFieldArray({
    name: 'entries',
    control,
    // shouldUnregister: true,
  });
  // console.log({
  //   fields,
  //   slItems: watch('entries'),
  //   customer: watch('customer'),
  // });

  useEffect(() => {
    console.log('mounting');

    return () => console.log('unmounting');
  }, []);

  // useEffect(() => {
  //   /**
  //    * add default entries
  //    */
  //   console.log('updating default entries');
  //   if (
  //     preentries &&
  //     Array.isArray(preentries) &&
  //     preentries.length > 0
  //   ) {
  //     // replace(preentries);
  //     // preentries.forEach(item => {
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

  const entriesFields = watch('entries');

  /**
   * using watch makes selecetd items(fields) to change on every render.
   * to avoid performance issues, convert formItems into a JSON string
   * useMemo and useEffect with be able to compare strings appropriately
   * and only rerender when value changes
   */
  const fieldsString = JSON.stringify(entriesFields || []);
  //compute summary values whenever selected items change
  const { summary, entriesObject } = useMemo(() => {
    /**
     * parse the json string to get back field values
     */
    const entries = JSON.parse(fieldsString);
    console.log({ entries });

    const entriesObject = entries.reduce((summary, entryDetails) => {
      const { account } = entryDetails;
      if (account) {
        return {
          ...summary,
          [account.accountId]: entryDetails,
        };
      } else {
        return summary;
      }
    }, {});

    console.log('generating summary');
    const summary = getSaleSummary(entries);

    return { entriesObject, summary };
  }, [fieldsString]);

  const addNewLine = useCallback(() => {
    console.log('adding new line');
    append({
      account: null,
      description: 0,
      contact: null,
      tax: null,
      debit: 0,
      credit: 0,
    });
  }, [append]);

  // console.log({ fields, errors });

  const removeItem = useCallback(
    index => {
      //fetch item from list using the index
      const item = getValues(`entries.${index}`);
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

  /**
   * function to update non-object values
   * (strings and numbers)
   */
  const updateEntryField = useCallback(
    (fieldName, value) => {
      setValue(fieldName, value);
    },
    [setValue]
  );

  useEffect(() => {
    console.log('taxes object changed');
  }, [taxesObject]);
  /**
   * function to update select object values
   */
  const handleSelectChange = useCallback(
    (fieldName, selectedValue, optionsObject) => {
      const selectedObjectValue = optionsObject[selectedValue];

      setValue(fieldName, selectedObjectValue);
    },
    [setValue]
  );

  // console.log({ errors });

  return (
    <VStack mt={1}>
      <Flex w="full" justify="flex-end" align="center" flexWrap="wrap">
        <Flex grow={1} h="32px" alignItems="center">
          <Heading size="md" as="h3">
            Entries
          </Heading>
        </Flex>
      </Flex>
      {fields.map((field, index) => {
        return (
          <EntryFields
            key={field.id}
            index={index}
            entriesObject={entriesObject || {}}
            removeItem={removeItem}
            updateEntryField={updateEntryField}
            field={field}
            taxesObject={taxesObject || {}}
            loading={loading}
            customers={customers || []}
            handleSelectChange={handleSelectChange}
            accountsObject={accountsObject || {}}
          />
        );
      })}
      <Flex w="full" justifyContent="flex-start">
        <Button
          onClick={addNewLine}
          size="sm"
          colorScheme="cyan"
          leftIcon={<RiAddLine />}
          disabled={loading}
        >
          add item
        </Button>
      </Flex>
      );
      <Grid w="full" rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[0, 4, 6]}></GridItem>
        <GridItem colSpan={[12, 8, 6]}>
          <JournalSummaryTable loading={loading} summary={summary} />
        </GridItem>
      </Grid>
    </VStack>
  );
}
