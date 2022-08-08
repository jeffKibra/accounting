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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import * as routes from '../../../nav/routes';
import PasswordInput from '../../ui/PasswordInput';

import { CardHeader } from '../../ui/Card';

function EmailPasswordForm(props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const { handleFormSubmit, loading } = props;

  return (
    <Flex w="full" justify="center" align="center">
      <Box bg="white" borderRadius="md" shadow="md" w={350} maxW="90%">
        <Box textAlign="center">
          <CardHeader>(Accounts)</CardHeader>
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
              isInvalid={!!errors.email}
            >
              <FormLabel>Email</FormLabel>
              <Input
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
                register={() =>
                  register('password', {
                    required: { value: true, message: 'Required!' },
                  })
                }
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button
              style={{ marginTop: 16 }}
              colorScheme="cyan"
              width="full"
              type="submit"
              isLoading={loading}
            >
              login
            </Button>
          </VStack>
        </Box>

        <Flex p={4} pt={0} justifyContent="center">
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
  );
}

EmailPasswordForm.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EmailPasswordForm;
