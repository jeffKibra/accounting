import { useState } from "react";
import { Box, Flex, Heading, Container } from "@chakra-ui/react";
import PropTypes from "prop-types";

import Stepper from "../../../components/ui/Stepper";

import OrgDetailsForm from "../../../components/forms/Orgs/OrgDetailsForm";
import AddressForm from "../../../components/forms/Orgs/AddressForm";

function EditOrg(props) {
  const { loading, org, saveData } = props;
  // console.log({ props });
  const [formValues, setFormValues] = useState(org || {});

  function updateFormValues(data) {
    setFormValues((current) => ({ ...current, ...data }));
  }

  function finish(data) {
    updateFormValues(data);

    const newData = {
      ...formValues,
      ...data,
    };
    // console.log({ newData });

    saveData({
      ...newData,
    });
  }

  return (
    <Flex w="full" justify="center" pt={6} px={[4, null, 0]}>
      <Container
        maxW="container.sm"
        bg="white"
        p={4}
        borderRadius="md"
        shadow="md"
        h="fit-content"
      >
        <Heading textAlign="center" as="h1" size="md" pb="30px">
          Set up your organization profile
        </Heading>
        <Container>
          <Stepper
            steps={[
              {
                label: "Details",
                content: (
                  <Box py="20px">
                    <OrgDetailsForm
                      loading={loading}
                      defaultValues={formValues}
                      handleFormSubmit={updateFormValues}
                      isAdmin={false}
                    />
                  </Box>
                ),
              },
              {
                label: "Address ",
                content: (
                  <Box py="20px">
                    <AddressForm
                      loading={loading}
                      defaultValues={formValues}
                      updateFormValues={updateFormValues}
                      handleFormSubmit={finish}
                    />
                  </Box>
                ),
              },
            ]}
          />
        </Container>
      </Container>
    </Flex>
  );
}

EditOrg.propTypes = {
  loading: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  org: PropTypes.shape({
    name: PropTypes.string,
    status: PropTypes.string,
    industry: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    contactPhone: PropTypes.string,
  }),
};

export default EditOrg;
