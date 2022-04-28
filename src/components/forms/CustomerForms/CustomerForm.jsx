import {
  FormControl,
  Input,
  Select,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Flex,
  Container,
} from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

import Card, { CardContent } from "../../ui/Card";

function Content({ children }) {
  return (
    <Container mt="4px" mb="4px" maxWidth="container.sm">
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </Container>
  );
}

function CustomerForm(props) {
  const { loading, onFormSubmit, org } = props;
  const { activeStep, nextStep, prevStep } = useSteps({ initialStep: 0 });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    ...(org ? { defaultValues: { ...org } } : {}),
  });

  function OrgDetails() {
    return (
      <Content>
        <FormControl isDisabled={loading} isRequired isInvalid={!!errors.name}>
          <FormLabel>Company Name</FormLabel>
          <Input
            {...register("name", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormHelperText>Company | Business Name</FormHelperText>
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={!!errors.industry}
        >
          <FormLabel>Industry</FormLabel>
          <Input
            {...register("industry", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormErrorMessage>{errors.industry?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={loading} isRequired isInvalid={!!errors.size}>
          <FormLabel>Size</FormLabel>
          <Select
            {...register("size", {
              required: { value: true, message: "Required!" },
            })}
          >
            <option value="">--select size--</option>
            <option value="individual">Individual (1)</option>
            <option value="micro">Micro (2-10)</option>
            <option value="small">Small (11-50)</option>{" "}
            <option value="medium">Medium (51-250)</option>
            <option value="large">Large (251+)</option>
          </Select>
          <FormHelperText>Based on number of employees|users</FormHelperText>
          <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
        </FormControl>
      </Content>
    );
  }

  function OrgContactDetails() {
    return (
      <Content>
        <FormControl isDisabled={loading} isRequired isInvalid={!!errors.phone}>
          <FormLabel>phone</FormLabel>
          <Input
            {...register("phone", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormHelperText>Format : 254 712 345678</FormHelperText>
          <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={!!errors.address}
        >
          <FormLabel>address</FormLabel>
          <Input
            {...register("address", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={loading} isRequired isInvalid={!!errors.city}>
          <FormLabel>city</FormLabel>
          <Input
            {...register("city", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={loading} isInvalid={!!errors.website}>
          <FormLabel>website</FormLabel>
          <Input {...register("website")} />
          <FormErrorMessage>{errors.website?.message}</FormErrorMessage>
        </FormControl>
      </Content>
    );
  }

  function ContactPerson(props) {
    return (
      <Content>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={!!errors.firstName}
        >
          <FormLabel>First Name</FormLabel>
          <Input
            {...register("firstName", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={!!errors.lastName}
        >
          <FormLabel>Last Name</FormLabel>
          <Input
            {...register("lastName", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={!!errors.contactPhone}
        >
          <FormLabel>Phone</FormLabel>
          <Input
            {...register("contactPhone", {
              required: { value: true, message: "Required!" },
            })}
          />
          <FormHelperText>Format: 254 789 789456</FormHelperText>
          <FormErrorMessage>{errors.contactPhone?.message}</FormErrorMessage>
        </FormControl>
      </Content>
    );
  }

  const steps = [
    {
      label: "Company Details",
      content: OrgDetails,
    },
    {
      label: "Company Contacts",
      content: OrgContactDetails,
    },
    {
      label: "Main Contact Person",
      content: ContactPerson,
    },
  ];

  function saveOrgData(data) {
    // console.log({ data });

    if (activeStep < steps.length - 1) {
      nextStep();
    }

    if (activeStep === steps.length - 1) {
      // console.log("completed");
      onFormSubmit(data);
    }
  }

  // console.log({ activeStep, ln: steps.length });

  return (
    <div>
      <form onSubmit={handleSubmit(saveOrgData)}>
        <Steps activeStep={activeStep}>
          {steps.map(({ label, content: Content }, i) => {
            return (
              <Step label={label} key={i}>
                <Content />
              </Step>
            );
          })}
        </Steps>{" "}
        <Flex justifyContent="space-around" mt="8px">
          {activeStep > 0 && (
            <Button
              isLoading={loading}
              variant="outline"
              colorScheme="cyan"
              onClick={prevStep}
            >
              prev
            </Button>
          )}

          <Button
            isLoading={loading}
            variant="outline"
            colorScheme="cyan"
            type="submit"
          >
            {activeStep === steps.length - 1 ? "complete" : "next"}
          </Button>
        </Flex>
      </form>
    </div>
  );
}

CustomerForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  customer: PropTypes.shape({
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

export default CustomerForm;
