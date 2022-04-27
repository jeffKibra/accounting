import PropTypes from "prop-types";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Button,
  VStack,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import * as routes from "../../../nav/routes";
import PasswordInput from "../../ui/PasswordInput";

import { CardHeader } from "../../ui/Card";

function CreateAccountForm(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ mode: "onChange" });

  const { handleFormSubmit, loading } = props;

  const password = watch("password");

  return (
    <VStack w="full" h="full" overflowY="auto">
      <Box w="full" minH="48px" h="48px" />
      <Box
        bg="white"
        borderRadius="md"
        shadow="md"
        w={350}
        maxW="90%"
        mt="24px"
      >
        <Box textAlign="center">
          <CardHeader>Accounts</CardHeader>
        </Box>

        <Box
          p={4}
          as="form"
          role="form"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <VStack spacing={2}>
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

            <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.confirmPassword}
            >
              <FormLabel>Confirm Password</FormLabel>
              <PasswordInput
                register={() =>
                  register("confirmPassword", {
                    required: { value: true, message: "Required!" },
                    validate: (value) => {
                      if (value !== password) {
                        return "Passwords dont match";
                      }
                    },
                  })
                }
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              style={{ marginTop: 16 }}
              colorScheme="cyan"
              isFullWidth
              type="submit"
              isLoading={loading}
            >
              create account
            </Button>
          </VStack>
        </Box>

        <Flex p={4} pt={0} justifyContent="center">
          <Text>
            Have an Account?{" "}
            <Link to={routes.LOGIN_USER}>
              <Button isDisabled={loading} variant="link">
                login
              </Button>
            </Link>
          </Text>
        </Flex>
      </Box>
      <Box w="full" minH="100px" h="100px" />
    </VStack>
  );
}

CreateAccountForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default CreateAccountForm;
