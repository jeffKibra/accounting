import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

function Items() {
  return (
    <div>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Type</Th>
            <Th>Rate</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );
}

export default Items;
