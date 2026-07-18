import { useEffect, useState } from "react";
import { createCampaign, updateCampaign } from "../api/campaignApi";
import { getCustomers } from "../api/customerApi";
import { getLeads } from "../api/leadApi";
import { getEmailTemplates } from "../api/emailTemplateApi";
import Select from "react-select";
import { X } from "lucide-react";

const CampaignModal = ({ isOpen, onClose, onSaved, campaign }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [templates, setTemplates] = useState([]); // list
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const customerOptions = customers.map((c) => ({
    value: c._id,
    label: `${c.name} (${c.email})`,
  }));

  const leadOptions = leads.map((l) => ({
    value: l._id,
    label: `${l.customer?.name} (${l.customer?.email})`,
  }));
  const templateOptions = templates.map((t) => ({
    value: t._id,
    label: t.name,
  }));

  useEffect(() => {
    if (isOpen) {
      getCustomers({ limit: 100 }).then((res) => setCustomers(res.data.data));
      getLeads().then((res) => setLeads(res.data.data));
      getEmailTemplates().then((res) => setTemplates(res.data.data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setName(campaign?.name || "");
    setDescription(campaign?.description || "");
    setSelectedCustomers(campaign?.customers?.map((c) => c._id || c) || []);
    setSelectedLeads(campaign?.leads?.map((l) => l._id || l) || []);
    setSelectedTemplate(campaign?.emailTemplate?._id || campaign?.emailTemplate || null);
    setIsScheduled(Boolean(campaign?.isScheduled));
    setScheduledAt(campaign?.scheduledAt ? campaign.scheduledAt.slice(0, 16) : "");
  }, [isOpen, campaign]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      emailTemplate: selectedTemplate,
      customers: selectedCustomers,
      leads: selectedLeads,
      isScheduled,
      scheduledAt: isScheduled ? scheduledAt : null,
    };

    if (campaign) {
      await updateCampaign(campaign._id, payload);
    } else {
      await createCampaign(payload);
    }

    onClose();
    onSaved();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {campaign ? "Edit Campaign" : "Create Email Campaign"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 rounded p-1"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 overflow-y-auto">
          {/* Campaign Name */}
          <input
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            placeholder="Campaign Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Description */}
          <textarea
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {/* Template Multi select */}
          <div>
            <p className="font-medium mb-1">Select Email Template</p>
            <Select
              options={templateOptions}
              value={templateOptions.find((opt) => opt.value === selectedTemplate) ?? null}
              onChange={(selected) => setSelectedTemplate(selected.value)}
              placeholder="Select email template..."
            />
          </div>
          {/* Customers Multi Select */}
          <div>
            <p className="font-medium mb-1">Select Customers</p>

            <Select
              isMulti
              options={customerOptions}
              value={customerOptions.filter((opt) => selectedCustomers.includes(opt.value))}
              onChange={(selected) =>
                setSelectedCustomers(selected.map((s) => s.value))
              }
              placeholder="Search & select customers..."
              className="text-sm"
            />
          </div>

          {/* Leads Multi Select */}
          <div>
            <p className="font-medium mb-1">Select Leads</p>

            <Select
              isMulti
              options={leadOptions}
              value={leadOptions.filter((opt) => selectedLeads.includes(opt.value))}
              onChange={(selected) =>
                setSelectedLeads(selected.map((s) => s.value))
              }
              placeholder="Search & select leads..."
              className="text-sm"
            />
          </div>

          {/* Schedule Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
            />
            <label>Schedule Campaign</label>
          </div>
          {isScheduled && (
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignModal;
