import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';

import { useToasts } from 'hooks';
import { getDirtyFields } from 'utils/functions';
import { GET_PAYMENT_TERMS } from '../../../store/actions/paymentTermsActions';

import Stepper from '../../../components/ui/Stepper';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import DetailsForm from '../../../components/forms/Vendors/DetailsForm';
import ExtraDetailsForm from '../../../components/forms/Vendors/ExtraDetailsForm';
import AddressForm, {
  addressPropTypes,
} from '../../../components/forms/Customers/AddressForm';

function EditVendor(props) {
  const {
    vendor,
    loading,
    saveData,
    getPaymentTerms,
    loadingPaymentTerms,
    paymentTerms,
  } = props;

  const toasts = useToasts();

  useEffect(() => {
    getPaymentTerms();
  }, [getPaymentTerms]);

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      companyName: vendor?.companyName || '',
      salutation: vendor?.salutation || '',
      firstName: vendor?.firstName || '',
      lastName: vendor?.lastName || '',
      displayName: vendor?.displayName || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      mobile: vendor?.mobile || '',
      billingAddress: vendor?.billingAddress || {},
      shippingAddress: vendor?.shippingAddress || {},
      paymentTerm: vendor?.paymentTerm?.value || 'on_receipt',
      website: vendor?.website || '',
      remarks: vendor?.remarks || '',
    },
  });
  const {
    handleSubmit,
    formState: { dirtyFields },
  } = formMethods;

  function handleFormSubmit(data) {
    const { paymentTerm: paymentTermId, ...rest } = data;
    let formValues = { ...rest };
    //retrieve paymentTerm object
    const paymentTerm = paymentTerms.find(term => term.value === paymentTermId);
    if (!paymentTerm) {
      toasts.error('Selected Payment Term not found!');
    }
    formValues.paymentTerm = paymentTerm;

    if (vendor) {
      //the vendor is being updated-submit only fields which have been changed
      formValues = getDirtyFields(dirtyFields, formValues);
    }

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
                  vendorId={vendor?.vendorId || ''}
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

//----------------------------------------------------------------

EditVendor.propTypes = {
  loading: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  vendor: PropTypes.shape({
    status: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    mobile: PropTypes.string,
    billingAddress: addressPropTypes,
    shippingAddress: addressPropTypes,
    website: PropTypes.string,
    paymentTermId: PropTypes.string,
    remarks: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  const { loading, action, paymentTerms } = state.paymentTermsReducer;
  const loadingPaymentTerms = loading && action === GET_PAYMENT_TERMS;

  return { loadingPaymentTerms, paymentTerms };
}

function mapDispatchToProps(dispatch) {
  return {
    getPaymentTerms: () => dispatch({ type: GET_PAYMENT_TERMS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVendor);
