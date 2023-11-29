// import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';

// import { useToasts } from '../../../hooks';
import { getDirtyFields } from '../../../utils/functions';

// import { GET_PAYMENT_TERMS } from '../../../store/actions/paymentTermsActions';

import Stepper from '../../../components/ui/Stepper';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import DetailsForm from '../../../components/forms/Customers/DetailsForm';
import ExtraDetailsForm from '../../../components/forms/Customers/ExtraDetailsForm';
import AddressForm, {
  addressPropTypes,
} from '../../../components/forms/Customers/AddressForm';

//----------------------------------------------------------------
// const apiOptions = {
//   method: 'GET',
//   headers: {
//     'X-RapidAPI-Key': '41d5f4d4a6msh5866044e89580f0p18dda8jsn7d3f6ad3aeec',
//     'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com',
//   },
// };

// function fetchCurrencyList() {
//   return fetch(
//     'https://currency-exchange.p.rapidapi.com/listquotes',
//     apiOptions
//   ).then(response => response.json());
// }

// function fetchCurrencyRate() {
//   return fetch(
//     'https://currency-exchange.p.rapidapi.com/exchange?from=MYR&to=KES&q=1.0',
//     apiOptions
//   ).then(response => response.json());
// }
//----------------------------------------------------------------

function EditCustomer(props) {
  const { customer, loading, saveData, loadingPaymentTerms, paymentTerms } =
    props;

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      type: customer?.type || '',
      companyName: customer?.companyName || '',
      salutation: customer?.salutation || '',
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      displayName: customer?.displayName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      billingAddress: customer?.billingAddress || {},
      shippingAddress: customer?.shippingAddress || {},
      paymentTerm: customer?.paymentTerm || null,
      website: customer?.website || '',
      remarks: customer?.remarks || '',
      ...(customer ? {} : { openingBalance: customer?.openingBalance || 0 }),
    },
  });
  const {
    handleSubmit,
    formState: { dirtyFields },
  } = formMethods;

  function handleFormSubmit(data) {
    // console.log({ data });
    delete data.paymentTerm.__typename;

    let formValues = { ...data };

    if (customer) {
      //the customer is being updated-submit only changed form values
      formValues = getDirtyFields(dirtyFields, formValues);
    }

    // console.log({ formValues });

    saveData(formValues);
  }

  return loadingPaymentTerms ? (
    <SkeletonLoader />
  ) : paymentTerms?.length > 0 ? (
    <FormProvider {...formMethods}>
      <Container
        maxW="container.sm"
        p={4}
        bg="white"
        borderRadius="md"
        shadow="md"
        as="form"
        role="form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Stepper
          steps={[
            {
              label: 'Details',
              content: <DetailsForm loading={loading} />,
            },
            {
              label: 'Address',
              content: <AddressForm loading={loading} />,
            },
            {
              label: 'Extras',
              content: (
                <ExtraDetailsForm
                  loading={loading}
                  paymentTerms={paymentTerms}
                  customerId={customer?._id || ''}
                />
              ),
            },
          ]}
        />
      </Container>
    </FormProvider>
  ) : (
    <Empty message="Payment Terms not found! Try to reload the page!" />
  );
}

EditCustomer.propTypes = {
  loading: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    type: PropTypes.string,
    companyName: PropTypes.string,
    salutation: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    mobile: PropTypes.string,
    billingAddress: addressPropTypes,
    shippingAddress: addressPropTypes,
    paymentTerm: PropTypes.object,
    website: PropTypes.string,
    remarks: PropTypes.string,
    openingBalance: PropTypes.number,
  }),
};

function mapStateToProps(state) {
  const org = state.orgsReducer?.org;
  const paymentTerms = org?.paymentTerms || [];

  return { paymentTerms };
}

export default connect(mapStateToProps)(EditCustomer);
