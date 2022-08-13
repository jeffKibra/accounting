import PropTypes from 'prop-types';
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
  Heading,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import * as routes from '../../../nav/routes';
import PasswordInput from '../../ui/PasswordInput';

function EmailPasswordForm(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const { handleFormSubmit, loading } = props;

  return (
    <VStack w="full" minH="100vh" overflowY="auto">
      <Box p={6} w="full">
        <Heading size="md">(Accounts)</Heading>
      </Box>
      <Flex pt={6} w="full" justifyContent="center" flexGrow={1}>
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
          <Heading mb={2} fontSize={['20px', null, '24px']}>
            Sign in
          </Heading>
          <Text mb={6} color="#637381">
            Enter your details below
          </Text>

          <Box as="form" role="form" onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack spacing={3}>
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

              <Box w="full" mt="24px!important">
                <Button
                  colorScheme="cyan"
                  width="full"
                  type="submit"
                  isLoading={loading}
                  size="lg"
                >
                  login
                </Button>
              </Box>
            </VStack>
          </Box>

          <Flex p={4} pt={3} justifyContent="center">
            <Text>
              Don't have an Account?{' '}
              <Link to={routes.SIGNUP}>
                <Button isDisabled={loading} variant="link">
                  signup
                </Button>
              </Link>
            </Text>
          </Flex>
        </Box>
      </Flex>
    </VStack>
  );
}

EmailPasswordForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EmailPasswordForm;
