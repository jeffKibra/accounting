import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";
import Dashboard from "../../../containers/Management/Dashboard/Dashboard";

function DashboardPage() {
  useSavedLocation().setLocation();

  return (
    <PageLayout pageTitle="Dashboard">
      <Dashboard />
    </PageLayout>
  );
}

export default DashboardPage;
