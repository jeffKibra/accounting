import PropTypes from 'prop-types';
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
  Grid,
  GridItem,
  Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import * as routes from '../../../nav/routes';
import PasswordInput from '../../ui/PasswordInput';

function CreateAccountForm(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const { handleFormSubmit, loading } = props;

  // const password = watch('password');

  return (
    <VStack w="full" h="full" overflowY="auto">
      <Box p={6} w="full">
        <Heading size="md">(Accounts)</Heading>
      </Box>
      <Box
        // borderWidth="1px"
        // borderColor="gray.300"
        // bg="white"
        // borderRadius="md"
        // shadow="md"
        w={500}
        maxW="90%"
        p={4}
      >
        <Heading mb={6} fontSize={['20px', null, '24px']}>
          Get Started
        </Heading>

        <Box as="form" role="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid templateColumns="repeat(12, 1fr)" rowGap={2} columnGap={4}>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.firstName}
              >
                <FormLabel>First Name</FormLabel>
                <Input
                  size="lg"
                  {...register('firstName', {
                    required: { value: true, message: 'Required!' },
                  })}
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={[12, 6]}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.lastName}
              >
                <FormLabel>Last Name</FormLabel>
                <Input
                  size="lg"
                  {...register('lastName', {
                    required: { value: true, message: 'Required!' },
                  })}
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.email}
              >
                <FormLabel>Email</FormLabel>
                <Input
                  size="lg"
                  {...register('email', {
                    required: { value: true, message: 'Required!' },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={12}>
              <FormControl
                isDisabled={loading}
                isRequired
                isInvalid={!!errors.password}
              >
                <FormLabel>Password</FormLabel>
                <PasswordInput
                  size="lg"
                  register={() =>
                    register('password', {
                      required: { value: true, message: 'Required!' },
                    })
                  }
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={12}>
              <Button
                style={{ marginTop: 16 }}
                colorScheme="cyan"
                w="full"
                type="submit"
                isLoading={loading}
                size="lg"
              >
                create account
              </Button>
            </GridItem>
          </Grid>

          {/* <FormControl
              isDisabled={loading}
              isRequired
              isInvalid={!!errors.confirmPassword}
            >
              <FormLabel>Confirm Password</FormLabel>
              <PasswordInput
              size="lg"
                register={() =>
                  register('confirmPassword', {
                    required: { value: true, message: 'Required!' },
                    validate: value => {
                      if (value !== password) {
                        return 'Passwords dont match';
                      }
                    },
                  })
                }
              />
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl> */}
        </Box>

        <Flex p={4} pt={3} justifyContent="center">
          <Text>
            Already have an account?{' '}
            <Link to={routes.LOGIN_USER}>
              <Button isDisabled={loading} variant="link">
                Login
              </Button>
            </Link>
          </Text>
        </Flex>
      </Box>
      {/* <Box w="full" minH="100px" h="100px" /> */}
    </VStack>
  );
}

CreateAccountForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default CreateAccountForm;
