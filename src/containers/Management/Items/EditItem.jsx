import { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { Container } from "@chakra-ui/react";
import PropTypes from "prop-types";

import { getDirtyFields } from "../../../utils/functions";
import { useToasts } from "../../../hooks";
import { GET_TAXES } from "../../../store/actions/taxesActions";

import Stepper from "../../../components/ui/Stepper";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import ItemDetailsForm from "../../../components/forms/Items/ItemDetailsForm";
import SalesDetailsForm from "../../../components/forms/Items/SalesDetailsForm";

function EditItem(props) {
  const {
    saveData,
    updating,
    loading,
    action,
    taxes,
    accounts,
    item,
    getTaxes,
  } = props;
  // console.log({ accounts });
  const toasts = useToasts();

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      name: item?.name || "",
      type: item?.type || "",
      variant: item?.variant || "",
      sku: item?.sku || "",
      skuOption: item?.skuOption || "barcode",
      unit: item?.unit || "",
      costPrice: item?.costPrice || 0,
      sellingPrice: item?.sellingPrice || 0,
      salesAccount: item?.salesAccount?.accountId || "sales",
      salesTax: item?.salesTax?.taxId || "",
      salesTaxType: item?.salesTaxType || "",
      extraDetails: item?.extraDetails || "",
    },
  });
  const {
    handleSubmit,
    formState: { dirtyFields },
  } = formMethods;

  const incomeAccounts = useMemo(() => {
    return accounts?.filter(({ accountType: { id } }) => id === "income");
  }, [accounts]);

  useEffect(() => {
    getTaxes();
  }, [getTaxes]);

  function handleFormSubmit(data) {
    const {
      salesTax: salesTaxId,
      salesAccount: salesAccountId,
      ...rest
    } = data;
    let formData = {
      ...rest,
    };
    //sales account
    let salesAccount = null;
    salesAccount = incomeAccounts.find(
      (account) => account.accountId === salesAccountId
    );
    if (!salesAccount) {
      return toasts.error("The Selected Sales Account is not valid!");
    }
    const { accountId, accountType, name } = salesAccount;
    //add value to newValues
    formData.salesAccount = { accountId, accountType, name };

    //tax account
    let salesTax = null;
    if (salesTaxId) {
      salesTax = taxes.find((tax) => tax.taxId === salesTaxId);
      if (!salesTax) {
        return toasts.error("The Selected Tax account is not valid!");
      }
      const { name, rate, taxId } = salesTax;
      //add tax to formData
      formData.salesTax = { name, rate, taxId };
    }

    if (item) {
      //the item is being updated. Only submit changed form values
      formData = getDirtyFields(dirtyFields, formData);
    }

    // console.log({ formData });
    saveData(formData);
  }

  return loading && action === GET_TAXES ? (
    <SkeletonLoader />
  ) : incomeAccounts?.length > 0 ? (
    <FormProvider {...formMethods}>
      <Container
        maxW="container.sm"
        bg="white"
        borderRadius="md"
        shadow="md"
        p={4}
        as="form"
        role="form"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Stepper
          steps={[
            {
              label: "Item Details",
              content: <ItemDetailsForm loading={updating} />,
            },
            {
              label: "Sales Details",
              content: (
                <SalesDetailsForm
                  accounts={incomeAccounts}
                  loading={updating}
                  taxes={taxes}
                />
              ),
            },
          ]}
        />
      </Container>
    </FormProvider>
  ) : (
    <Empty message="Accounts Data not found!" />
  );
}

EditItem.propTypes = {
  updating: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  item: PropTypes.object,
};

function mapStateToProps(state) {
  const { accounts } = state.accountsReducer;
  const { loading, action, taxes } = state.taxesReducer;

  return {
    loading,
    action,
    taxes,
    accounts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTaxes: () => dispatch({ type: GET_TAXES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);
