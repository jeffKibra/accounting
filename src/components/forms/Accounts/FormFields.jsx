import { useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  //   Button,
  VStack,
  //   Box,
} from '@chakra-ui/react';

import { useFormContext, Controller } from 'react-hook-form';

import ControlledSelect from 'components/ui/ControlledSelect';

export default function FormFields({ loading, accountTypes }) {
  // console.log({ accountTypes });

  const { accountTypesMap, accountTypesList } = useMemo(() => {
    let map = {};
    let list = []; //name and value

    map = accountTypes.reduce((acc, accountType) => {
      const { name, id, main } = accountType;
      list.push({ name, value: id, groupName: main });

      return {
        ...acc,
        [id]: accountType,
      };
    }, {});

    return {
      accountTypesMap: map,
      accountTypesList: list,
      originalList: accountTypes,
    };
  }, [accountTypes]);

  // console.log({ accountTypesMap });

  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <VStack>
      <Controller
        name="accountType"
        control={control}
        rules={{ required: { value: true, message: '*Required!' } }}
        render={({
          field: { value, onChange, name, onBlur },
          fieldState: { error },
        }) => {
          // console.log({ value });
          // console.log('field error', error);

          function onAccountTypeChange(accountTypeId) {
            // console.log({ accountTypeId });
            const accountType = accountTypesMap[accountTypeId];
            // console.log({ accountType });

            onChange(accountType);
          }

          return (
            <FormControl isRequired isDisabled={loading} isInvalid={!!error}>
              <FormLabel>Account Type</FormLabel>
              <ControlledSelect
                groupedOptions={accountTypesList}
                value={value?.id || ''}
                onChange={onAccountTypeChange}
                onBlur={onBlur}
                isDisabled={loading}
              />

              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          );
        }}
      />

      <FormControl isRequired isDisabled={loading} isInvalid={!!errors?.name}>
        <FormLabel>Account Name</FormLabel>
        <Input
          {...register('name', {
            required: { value: true, message: '!Required!' },
          })}
        />
        <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
      </FormControl>

      {/* <FormControl isDisabled={loading} isInvalid={!!errors?.code}>
        <FormLabel>Account Code</FormLabel>
        <Input {...register('code')} />
        <FormHelperText></FormHelperText>

        <FormErrorMessage></FormErrorMessage>
      </FormControl> */}

      <FormControl isDisabled={loading} isInvalid={!!errors?.description}>
        <FormLabel>Account Description</FormLabel>
        <Textarea {...register('description')} />
        <FormHelperText></FormHelperText>

        <FormErrorMessage></FormErrorMessage>
      </FormControl>
    </VStack>
  );
}
