import { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { GET_TAXES } from "../../../store/actions/taxesActions";
import { GET_ACCOUNTS } from "../../../store/actions/accountsActions";

import Stepper from "../../../components/ui/Stepper";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import ItemDetailsForm from "../../../components/forms/Items/ItemDetailsForm";
import SalesDetailsForm from "../../../components/forms/Items/SalesDetailsForm";
import PurchaseDetailsForm from "../../../components/forms/Items/PurchaseDetailsForm";

function EditItem(props) {
  const {
    saveData,
    updating,
    getAccounts,
    loading,
    action,
    accounts,
    item,
    loadingTaxes,
    taxesAction,
    taxes,
    getTaxes,
  } = props;
  // console.log({ accounts, taxes });

  const [formValues, setFormValues] = useState(item || {});

  useEffect(() => {
    getAccounts();
    getTaxes();
  }, [getAccounts, getTaxes]);

  function updateFormValues(data) {
    setFormValues((current) => ({ ...current, ...data }));
  }

  function handleFormSubmit(data) {
    // console.log({ data });
    const { salesTaxId, salesAccountId } = data;

    //sales account
    let salesAccount = {};

    salesAccount = accounts.find(
      (account) => account.accountId === salesAccountId
    );

    if (salesAccount) {
      const { accountId, accountType, name } = salesAccount;

      salesAccount = { accountId, accountType, name };
    }

    //tax account
    let salesTax = {};

    if (salesTaxId) {
      const temp = taxes.find((tax) => tax.taxId === salesTaxId);
      if (temp) {
        const { name, rate, taxId } = temp;
        salesTax = { name, rate, taxId };
      }
    }

    const newData = {
      ...data,
      salesTax,
      salesAccount,
    };
    // console.log({ newData });
    saveData(newData);
  }

  return (loading && action === GET_ACCOUNTS) ||
    (loadingTaxes && taxesAction === GET_TAXES) ? (
    <SkeletonLoader />
  ) : accounts ? (
    <Stepper
      steps={[
        {
          label: "Item Details",
          content: (
            <ItemDetailsForm
              loading={updating}
              defaultValues={formValues}
              handleFormSubmit={updateFormValues}
            />
          ),
        },
        {
          label: "Purchase Details",
          content: (
            <PurchaseDetailsForm
              accounts={accounts}
              loading={updating}
              defaultValues={formValues}
              handleFormSubmit={updateFormValues}
              taxes={taxes}
            />
          ),
        },
        {
          label: "Sales Details",
          content: (
            <SalesDetailsForm
              accounts={accounts}
              loading={updating}
              defaultValues={formValues}
              updateFormValues={updateFormValues}
              handleFormSubmit={handleFormSubmit}
              taxes={taxes}
            />
          ),
        },
      ]}
    />
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
  const { loading, isModified, action, accounts } = state.accountsReducer;
  const {
    loading: loadingTaxes,
    action: taxesAction,
    taxes,
  } = state.taxesReducer;

  return {
    loading,
    isModified,
    action,
    accounts,
    loadingTaxes,
    taxesAction,
    taxes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAccounts: () => dispatch({ type: GET_ACCOUNTS, mainTypes: ["income"] }),
    getTaxes: () => dispatch({ type: GET_TAXES }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);
