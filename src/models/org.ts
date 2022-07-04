export interface OrgSummary {
  orgId: string;
  name: string;
  businessType: {
    name: string;
    value: string;
  };
}

export interface Org extends OrgSummary {
  id: string;
  city: string;
  country: string;
  industry: string;
  phone: string;
  postalCode: string;
  state: string;
  street: string;
  website: string;
}
