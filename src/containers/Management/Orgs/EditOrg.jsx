import { useState } from "react";

import PropTypes from "prop-types";

import Stepper from "../../../components/ui/Stepper";

import OrgDetailsForm from "../../../components/forms/Orgs/OrgDetailsForm";
import ContactDetailsForm from "../../../components/forms/Orgs/ContactDetailsForm";
import ContactPersonForm from "../../../components/forms/Orgs/ContactPersonForm";

function EditOrg(props) {
  const { loading, org, saveData } = props;
  console.log({ props });
  const [formValues, setFormValues] = useState(org || {});

  function updateFormValues(data) {
    setFormValues((current) => ({ ...current, ...data }));
  }

  function finish(data) {
    updateFormValues(data);

    saveData({
      ...formValues,
      ...data,
    });
  }

  return (
    <Stepper
      steps={[
        {
          label: "Organization Details",
          content: (
            <OrgDetailsForm
              loading={loading}
              defaultValues={formValues}
              handleFormSubmit={updateFormValues}
              isAdmin={false}
            />
          ),
        },
        {
          label: "Organization Contacts",
          content: (
            <ContactDetailsForm
              loading={loading}
              defaultValues={formValues}
              handleFormSubmit={updateFormValues}
            />
          ),
        },
        {
          label: "Main Contact Person",
          content: (
            <ContactPersonForm
              loading={loading}
              defaultValues={formValues}
              handleFormSubmit={finish}
              updateFormValues={updateFormValues}
            />
          ),
        },
      ]}
    />
  );
}

EditOrg.propTypes = {
  loading: PropTypes.bool.isRequired,
  saveData: PropTypes.func.isRequired,
  org: PropTypes.shape({
    name: PropTypes.string,
    status: PropTypes.string,
    industry: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    contactPhone: PropTypes.string,
  }),
};

export default EditOrg;
