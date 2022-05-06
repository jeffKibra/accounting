import { Grid, GridItem } from "@chakra-ui/react";

import SummaryTable from "../../tables/Invoices/SummaryTable";

function Summary(props) {
  console.log({ props });

  return (
    <Grid w="full" rowGap={4} columnGap={4} templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={[1, 4, 6]}></GridItem>
      <GridItem
        colSpan={[11, 8, 6]}
        bg="white"
        p={4}
        borderRadius="md"
        shadow="md"
      >
        <SummaryTable {...props} />
      </GridItem>
    </Grid>
  );
}

Summary.propTypes = {
  ...SummaryTable.propTypes,
};

export default Summary;
