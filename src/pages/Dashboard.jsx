import Layout from "../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Customers</p>
          <h2 className="text-3xl font-bold">—</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Leads</p>
          <h2 className="text-3xl font-bold">—</h2>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Activity Logs</p>
          <h2 className="text-3xl font-bold">—</h2>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
