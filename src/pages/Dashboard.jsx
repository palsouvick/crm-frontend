import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { totalCustomer } from "../api/customerApi";
import { totalLeads, getLeadsGrowth, getLeadStatus } from "../api/leadApi";
import { totalFollowUps } from "../api/followUpApi";
import { promise } from "zod";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [leadsGrowth, setLeadsGrowth] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [customer, setCustomer] = useState(0);
  const [lead, setLead] = useState(0);
  const [followUp, setFollowUp] = useState(0);
  const [activity, setActivity] = useState(0);

  const fetchData = async () => {
    try {
      const [res, res2, res3, growthRes, statusRes] = await Promise.all([
        totalCustomer(),
        totalLeads(),
        totalFollowUps(),
        getLeadsGrowth(),
        getLeadStatus(),
      ]);
      setCustomer(res.data.total);
      setLead(res2.data.total);
      setFollowUp(res3.data.total);
      setLeadsGrowth(growthRes.data);
      setLeadStatus(statusRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch leads or customers", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value} leads</p>
        </div>
      );
    }
    return null;
  };

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
          value={followUp}
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
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* STATUS PIE */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4 text-gray-800">Lead Status</h2>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={leadStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {leadStatus.map((status, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-gray-600">{status.name}</span>
                    </div>
                    <span className="font-semibold">{status.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
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
