import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCampaignById,
  sendTestEmail,
  startCampaign,
} from "../api/campaignApi";
import {
  FiUsers,
  FiSend,
  FiMail,
  FiMousePointer,
  FiAlertCircle,
} from "react-icons/fi";
import TestEmailModal from "../components/TestEmailModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CampaignView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaigns] = useState(null);
  const [stats, setStats] = useState({});
  const [tab, setTab] = useState("all");
  const [recipients, setRecipients] = useState([]);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [mainTab, setMainTab] = useState("recipients");
  const [recipientType, setRecipientType] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        console.log("id -", id);
        const res = await getCampaignById(id);
        console.log("response -", res);
        console.log("id -", id);
        setCampaigns(res.data.campaign);
        setStats(res.data.stats);
        setRecipients(res.data.recipients);
      } catch (error) {
        console.error("Fecth failed", error);
      }
    };
    fetchCampaign();
  }, [id]);

  const handleSendTestMail = async (email) => {
    try {
      setSendingTest(true);
      const res = await sendTestEmail(id, { email });
      console.log("response -", res);
      console.log("id -", id);
      if (res.data.error) {
        toast.error(res.data.error);
        setTestModalOpen(false);
        setSendingTest(false);
        return;
      }
      toast.success("Test email sent successfully");
      setTestModalOpen(false);
      setSendingTest(false);
    } catch (error) {
      setTestModalOpen(false);
      setSendingTest(false);
      console.error("Fecth failed", error);
    }
  };

  const handleStartCampaign = async () => {
    try {
      setSendingTest(true);
      const res = await startCampaign(id);
      console.log("response -", res);
      console.log("id -", id);
      if (res.data.success) {
        setSendingTest(false);
        toast.success("Campaign started successfully");
        // Immediately fetch updated data
        await fetchCampaign();
      }
      setSendingTest(false);
    } catch (error) {
      setSendingTest(false);
      console.error("Fecth failed", error);
    }
  };

  const filteredRecipients = recipients.filter(
    (r) => recipientType === "all" || r.recipientType === recipientType
  );

  const totalPages = Math.ceil(filteredRecipients.length / pageSize);

  const paginatedRecipients = filteredRecipients.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ✅ ADD THIS HERE
  if (!campaign) {
    return (
      <div className="p-6 text-gray-500 text-center">Loading campaign...</div>
    );
  }
  return (
    <>
      <div className="bg-white p-4 rounded shadow h-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{campaign?.name}</h1>
            <span
              className={`mt-1 inline-block px-2 py-1 text-xs rounded-full
                ${
                  campaign.status === "running" && "bg-green-100 text-green-700"
                }
                ${campaign.status === "draft" && "bg-gray-100 text-gray-600"}
                ${
                  campaign.status === "paused" &&
                  "bg-yellow-100 text-yellow-700"
                }
                `}
            >
              {campaign.status}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="px-3 py-2 border rounded"
              onClick={() => {
                setTestModalOpen(true);
              }}
            >
              Send Test
            </button>

            {campaign.status === "Completed" ? (
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                disabled
              >
                Completed
              </button>
            ) : campaign.status !== "running" ? (
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleStartCampaign}
              >
                {sendingTest ? "Starting..." : "Start Campaign"}
              </button>
            ) : (
              <button className="px-4 py-2 bg-yellow-500 text-white rounded">
                Pause
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            {
              label: "Total",
              value: stats.total,
              bg: "from-indigo-500 to-indigo-600",
              icon: <FiUsers className="text-3xl opacity-80" />,
            },
            {
              label: "Sent",
              value: stats.sent,
              bg: "from-blue-500 to-blue-600",
              icon: <FiSend className="text-3xl opacity-80" />,
            },
            {
              label: "Opened",
              value: stats.opened,
              bg: "from-green-500 to-green-600",
              icon: <FiMail className="text-3xl opacity-80" />,
            },
            {
              label: "Clicked",
              value: stats.clicked,
              bg: "from-purple-500 to-purple-600",
              icon: <FiMousePointer className="text-3xl opacity-80" />,
            },
            {
              label: "Failed",
              value: stats.failed,
              bg: "from-red-500 to-red-600",
              icon: <FiAlertCircle className="text-3xl opacity-80" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`relative overflow-hidden rounded-xl p-4 shadow-lg bg-gradient-to-r ${s.bg} text-white`}
            >
              {/* Icon */}
              <div className="absolute right-4 top-4">{s.icon}</div>

              {/* Content */}
              <p className="text-sm opacity-90">{s.label}</p>
              <p className="text-2xl font-bold">{s.value ?? 0}</p>
            </div>
          ))}
        </div>

        {/* MAIN TABS */}
        <div className="mb-4 flex gap-3 border-b">
          {[
            { key: "recipients", label: "Recipients" },
            { key: "template", label: "Email Template" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setMainTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                mainTab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mainTab === "template" && (
          <div className="bg-white p-5 rounded shadow-sm mb-6">
            <h2 className="font-semibold mb-2">📧 Email Template</h2>

            <p className="text-sm text-gray-500 mb-1">
              Subject:{" "}
              <span className="font-medium">
                {campaign.emailTemplate?.subject}
              </span>
            </p>

            <div className="border rounded p-3 bg-gray-50 max-h-48 overflow-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html: campaign.emailTemplate?.body,
                }}
              />
            </div>
          </div>
        )}
        {mainTab === "recipients" && (
          <>
            <div className="mb-3 flex gap-3">
              {["all", "customer", "lead"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setRecipientType(t);
                    setPage(1); // Reset to page 1 when filter changes
                  }}
                  className={`px-3 py-1 rounded text-sm
        ${tab === t ? "bg-blue-600 text-white" : "bg-gray-100"}
      `}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <table className="w-full text-sm bg-white rounded shadow-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recipients.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No recipients found
                    </td>
                  </tr>
                ) : (
                  paginatedRecipients
                    .map((r) => (
                      <tr key={r._id} className="border-t">
                        <td className="p-3">{r.name}</td>
                        <td className="p-3">{r.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold
      ${
        r.recipientType === "customer"
          ? "bg-indigo-100 text-indigo-700"
          : "bg-orange-100 text-orange-700"
      }`}
                          >
                            {r.recipientType}
                          </span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-semibold
      ${r.status === "pending" && "bg-gray-100 text-gray-400"}
      ${r.status === "sent" && "bg-blue-100 text-blue-700"}
      ${r.status === "opened" && "bg-green-100 text-green-700"}
      ${r.status === "clicked" && "bg-purple-100 text-purple-700"}
      ${r.status === "failed" && "bg-red-100 text-red-700"}
    `}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            {/* {totalPages > 1 && ( */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="px-3 py-1 text-sm">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            {/* )} */}
          </>
        )}
        <TestEmailModal
          isOpen={testModalOpen}
          onClose={() => setTestModalOpen(false)}
          onSend={handleSendTestMail}
          template={campaign.emailTemplate}
          loading={sendingTest}
        />
      </div>
    </>
  );
};

export default CampaignView;
