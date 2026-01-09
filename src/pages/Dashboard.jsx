import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { totalCustomer } from "../api/customerApi";
import {totalLeads} from "../api/leadApi";
import { promise } from "zod";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [leadsGrowth, setLeadsGrowth] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [customer, setCustomer] = useState(0);
  const [lead, setLead] = useState(0);

  const fetchData = async() => {
    try{
      const [res, res2] = await Promise.all([totalCustomer(), totalLeads()]);
      setCustomer(res.data.total);
      setLead(res2.data.total);
      console.log(res.data);
    }catch(error){
      console.error("Failed to fetch leads or customers", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Overview of your CRM performance
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={customer}
          icon="🧑"
          color="bg-indigo-600"
        />

        <StatCard
          title="Total Leads"
          value={lead}
          icon="📋"
          color="bg-emerald-500"
        />

        <StatCard
          title="Follow Ups"
          value="—"
          icon="⏰"
          color="bg-orange-500"
        />

        <StatCard
          title="Activity Logs"
          value="—"
          icon="📝"
          color="bg-purple-500"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* LEADS CHART */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4 text-gray-800">Leads Growth</h2>

          {/* CHART PLACEHOLDER */}
          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
            📈 Chart will be here
          </div>
        </div>

        {/* STATUS PIE */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4 text-gray-800">Lead Status</h2>

          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
            🥧 Pie chart
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold mb-4 text-gray-800">Recent Activities</h2>

        <ul className="space-y-3 text-sm">
          <li className="flex justify-between">
            <span className="text-gray-600">New lead added</span>
            <span className="text-gray-400">2 mins ago</span>
          </li>

          <li className="flex justify-between">
            <span className="text-gray-600">Customer profile updated</span>
            <span className="text-gray-400">1 hour ago</span>
          </li>

          <li className="flex justify-between">
            <span className="text-gray-600">Follow-up scheduled</span>
            <span className="text-gray-400">Today</span>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Dashboard;
