import { Box, Button, Flex } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
//
import BookingDaysSelector from './Components/BookingDaysSelector';
//

function BookingDaysSelectorForm(props) {
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const [searchParams, setSearchParams] = useSearchParams();

  function onSubmit(data) {
    const startDate = new Date(data?.startDate).toISOString();
    const endDate = new Date(data?.endDate).toISOString();

    // console.log({ startDate, endDate });

    setSearchParams({
      startDate,
      endDate,
    });
  }

  console.log({ searchParamsString: searchParams.toString(), searchParams });
  //   console.log({ paramsString: params.toString(), params });

  return (
    <FormProvider {...formMethods}>
      <Box
        w="full"
        as="form"
        role="form"
        onSubmit={handleSubmit(onSubmit)}
        mt={2}
        p={4}
        pb={6}
        bg="white"
        borderRadius="lg"
        shadow="lg"
        border="1px solid"
        borderColor="gray.200"
      >
        <BookingDaysSelector />
        <Flex justify="flex-end">
          <Button size="lg" type="submit" colorScheme="cyan">
            search
          </Button>
        </Flex>
      </Box>
    </FormProvider>
  );
}

export default BookingDaysSelectorForm;
