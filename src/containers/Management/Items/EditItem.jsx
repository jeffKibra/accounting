import { useEffect, useState, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

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

  const [formValues, setFormValues] = useState(item || {});

  const incomeAccounts = useMemo(() => {
    return accounts?.filter(({ accountType: { id } }) => id === "income");
  }, [accounts]);

  useEffect(() => {
    getTaxes();
  }, [getTaxes]);

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

  return loading && action === GET_TAXES ? (
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
          label: "Sales Details",
          content: (
            <SalesDetailsForm
              accounts={incomeAccounts}
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
