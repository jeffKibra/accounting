import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Container } from "@chakra-ui/react";
import { useForm, FormProvider } from "react-hook-form";

import { confirmFutureDate } from "utils/dates";
import { useToasts, useGetSalesProps } from "hooks";
import { getDirtyFields } from "utils/functions";

import Stepper from "../../../components/ui/Stepper";
import SkeletonLoader from "components/ui/SkeletonLoader";
import Empty from "components/ui/Empty";

import InvoiceForm from "../../../components/forms/Invoice/InvoiceForm";
import EditSale from "../Sales/EditSale";

function EditInvoice(props) {
  const { invoice, handleFormSubmit, updating } = props;
  // console.log({ props });
  const today = new Date();

  const { loading, items, customers, paymentTerms } = useGetSalesProps();

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      customer: invoice?.customer?.customerId || "",
      orderNumber: invoice?.orderNumber || "",
      invoiceDate: invoice?.invoiceDate || today,
      paymentTerm: invoice?.paymentTerm?.value || "on_receipt",
      dueDate: invoice?.dueDate || today,
      subject: invoice?.subject || "",
      customerNotes: invoice?.customerNotes || "",
      taxType: invoice?.summary?.taxType || "taxExclusive",
      shipping: invoice?.summary?.shipping || 0,
      adjustment: invoice?.summary?.adjustment || 0,
      selectedItems: invoice?.selectedItems || {},
    },
  });
  const {
    handleSubmit,
    formState: { dirtyFields },
  } = formMethods;

  const toasts = useToasts();

  function onSubmit(data) {
    const { customer: customerId, paymentTerm: paymentTermId, ...rest } = data;
    const { invoiceDate, dueDate } = rest;
    let formValues = { ...rest };
    /**
     * ensure dueDate is not a past date
     */
    const dueDateIsFuture = confirmFutureDate(invoiceDate, dueDate);
    if (!dueDateIsFuture) {
      return toasts.error("Due date cannot be less than invoice date");
    }

    const customer = customers.find(
      (customer) => customer.customerId === customerId
    );
    if (!customer) {
      return toasts.error("Selected an Invalid customer");
    }
    formValues.customer = customer;

    const paymentTerm = paymentTerms.find(
      (term) => term.value === paymentTermId
    );
    if (!paymentTerm) {
      return toasts.error("Selected Payment Term is not a valid Payment Term");
    }
    formValues.paymentTerm = paymentTerm;

    if (invoice) {
      //invoice is being updated-submit only the changed values
      formValues = getDirtyFields(dirtyFields, formValues);
    }
    console.log({ formValues });

    //submit the data
  }

  console.log({ customers, items, paymentTerms, loading });

  return loading ? (
    <SkeletonLoader />
  ) : customers?.length > 0 && items?.length > 0 && paymentTerms?.length > 0 ? (
    <FormProvider {...formMethods}>
      <Box
        as="form"
        role="form"
        onSubmit={handleSubmit(onSubmit)}
        w="full"
        h="full"
      >
        <Stepper
          steps={[
            {
              label: "Add Items",
              content: <EditSale loading={updating} items={items} />,
            },
            {
              label: "Invoice Details",
              content: (
                <Container
                  mt={2}
                  p={4}
                  bg="white"
                  borderRadius="md"
                  shadow="md"
                  maxW="container.sm"
                >
                  <InvoiceForm
                    customers={customers}
                    paymentTerms={paymentTerms}
                    loading={loading}
                  />
                </Container>
              ),
            },
          ]}
        />
      </Box>
    </FormProvider>
  ) : items?.length === 0 ? (
    <Empty message="Please add atleast one ITEM to continue or reload the page" />
  ) : customers?.length === 0 ? (
    <Empty message="Please add atleast one CUSTOMER to continue or reload the page" />
  ) : (
    <Empty message="Payment Terms not Found. Try Reloading the page" />
  );
}

EditInvoice.propTypes = {
  handleFormSubmit: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  invoice: PropTypes.shape({
    summary: PropTypes.shape({
      shipping: PropTypes.number,
      adjustment: PropTypes.number,
      totalTax: PropTypes.number,
      totalAmount: PropTypes.number,
      subTotal: PropTypes.number,
      taxes: PropTypes.array,
    }),
    selectedItems: PropTypes.array,
    customerId: PropTypes.string,
    invoiceDate: PropTypes.instanceOf(Date),
    dueDate: PropTypes.instanceOf(Date),
    subject: PropTypes.string,
    customerNotes: PropTypes.string,
    invoiceId: PropTypes.string,
  }),
};

export default EditInvoice;
