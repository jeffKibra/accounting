import { Grid, GridItem, Text } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import JournalSummaryTable from 'components/tables/Journal/SummaryTable';

export default function Summary() {
  const { control } = useFormContext();

  return (
    <Controller
      name="summary"
      control={control}
      shouldUnregister
      render={({ field: { value }, fieldState: { error } }) => {
        return (
          <Grid
            w="full"
            rowGap={2}
            columnGap={4}
            templateColumns="repeat(12, 1fr)"
          >
            <GridItem colSpan={[0, 4, 6]}></GridItem>
            <GridItem colSpan={[12, 8, 6]}>
              <JournalSummaryTable summary={value} />
            </GridItem>

            <GridItem colSpan={12} display="flex" justifyContent="flex-end">
              {error?.message ? (
                <Text color="red" fontSize="14px">
                  {error.message}
                </Text>
              ) : null}
            </GridItem>
          </Grid>
        );
      }}
    />
  );
}
