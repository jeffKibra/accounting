import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import CustomDatePicker from '../../ui/CustomDatePicker';

//---------------------------------------------------------------
FormFields.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default function FormFields(props) {
  const { loading } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Box pb={1}>
      <Grid mb={2} rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isRequired isInvalid={errors.date}>
            <FormLabel htmlFor="journalDate">Date</FormLabel>
            <CustomDatePicker size="md" name="journalDate" required />
            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isDisabled={loading} isInvalid={errors.reference}>
            <FormLabel htmlFor="reference">Reference</FormLabel>
            <Input id="reference" {...register('reference')} />
          </FormControl>
        </GridItem>

        <GridItem colSpan={[12, 6]}>
          <FormControl isRequired isDisabled={loading} isInvalid={errors.notes}>
            <FormLabel htmlFor="notes">Notes</FormLabel>
            <Textarea
              placeholder="Journal summary."
              id="notes"
              {...register('notes', {
                required: { value: true, message: 'Required!' },
              })}
              rows={2}
              resize="none"
            />
            <FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
    </Box>
  );
}
