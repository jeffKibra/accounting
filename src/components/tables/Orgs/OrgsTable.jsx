import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

import TableActions from "../../ui/TableActions";

import Card, { CardContent } from "../../ui/Card";

function OrgsTable(props) {
  const { orgs, deleting, deleteOrg, isDeleted } = props;
  return (
    <Card>
      <CardContent>
        <Box w="full" overflowX="auto">
          <Table minW="650px" variant="simple">
            <Thead>
              <Tr>
                <Th />
                <Th>Org Name</Th>
                <Th>Status</Th>
                <Th>Industry</Th>
                <Th>Date Created</Th>
                <Th>Date Modified</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orgs.map((org, i) => {
                const { name, status, industry, createdAt, modifiedAt, id } =
                  org;
                return (
                  <Tr key={i}>
                    <Td pt="0px" pb="0px">
                      <TableActions
                        editRoute={`${id}/edit`}
                        loading={deleting}
                        title="Delete Organization"
                        message="Are you sure you want to delete this Organization? This action cannot be undone!"
                        onConfirm={() => deleteOrg(id)}
                        isDeleted={isDeleted}
                      />
                    </Td>
                    <Td>{name}</Td>
                    <Td>{status}</Td>
                    <Td>{industry}</Td>
                    <Td>{new Date(createdAt.seconds * 1000).toDateString()}</Td>
                    <Td>
                      {new Date(modifiedAt.seconds * 1000).toDateString()}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}

OrgsTable.propTypes = {
  orgs: PropTypes.array.isRequired,
  deleting: PropTypes.bool.isRequired,
  deleteOrg: PropTypes.func.isRequired,
  isDeleted: PropTypes.bool.isRequired,
};

export default OrgsTable;
