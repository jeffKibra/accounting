import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";

function DashboardPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Dashboard Page">
      <p>dashboard</p>
    </PageLayout>
  );
}

export default DashboardPage;
