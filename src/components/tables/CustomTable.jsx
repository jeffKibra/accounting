import { Box } from "@chakra-ui/react";

import CustomRawTable from "./CustomRawTable";

function CustomTable(props) {
  const { columns, data, caption } = props;
  //   console.log({ instance });

  return (
    <Box w="full" bg="white" borderRadius="md" shadow="md" p={4}>
      <CustomRawTable caption={caption} columns={columns} data={data} />
    </Box>
  );
}

CustomTable.propTypes = {
  ...CustomRawTable.propTypes,
};

export default CustomTable;
