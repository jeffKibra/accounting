import { Box } from "@chakra-ui/react";

import CustomRawTable from "./CustomRawTable";

function CustomTable(props) {
  const { columns, data, caption, ...rest } = props;
  //   console.log({ instance });

  return (
    <Box w="full" bg="white" borderRadius="md" shadow="md" py={4}>
      <CustomRawTable
        {...rest}
        caption={caption}
        columns={columns}
        data={data}
      />
    </Box>
  );
}

CustomTable.propTypes = {
  ...CustomRawTable.propTypes,
};

export default CustomTable;
