import PropTypes from "prop-types";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Button,
  VStack,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import * as routes from "../../../nav/routes";
import PasswordInput from "../../ui/PasswordInput";

import Card, { CardContent, CardHeader } from "../../ui/Card";

function EmailPasswordForm(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" });

  const { handleFormSubmit, loading } = props;

  return (
    <Box w={350} maxW="90%">
      <Card>
        <Box textAlign="center">
          <CardHeader>Accounts</CardHeader>
        </Box>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={2}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.email}
              >
                <FormLabel>Email</FormLabel>
                <Input
                  {...register("email", {
                    required: { value: true, message: "Required!" },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.password}
              >
                <FormLabel>Password</FormLabel>
                <PasswordInput
                  register={() =>
                    register("password", {
                      required: { value: true, message: "Required!" },
                    })
                  }
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Button
                style={{ marginTop: 16 }}
                colorScheme="cyan"
                isFullWidth
                type="submit"
                isLoading={loading}
              >
                login
              </Button>
            </VStack>
          </form>
          {!loading && (
            <Flex mt="16px" justifyContent="center">
              <Text>
                Don't have an Account?{" "}
                <Link to={routes.SIGNUP}>
                  <Button variant="link">signup</Button>
                </Link>
              </Text>
            </Flex>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

EmailPasswordForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EmailPasswordForm;
