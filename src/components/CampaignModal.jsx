import { useEffect, useState } from "react";
import { createCampaign } from "../api/campaignApi";
import { getCustomers } from "../api/customerApi";
import { getLeads } from "../api/leadApi";
import { getEmailTemplates } from "../api/emailTemplateApi";
import Select from "react-select";

const CampaignModal = ({ isOpen, onClose, onCreated }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createCampaign({
      name,
      description,
      emailTemplate: selectedTemplate,
      customers: selectedCustomers,
      leads: selectedLeads,
      isScheduled,
      scheduledAt: isScheduled ? scheduledAt : null,
    });

    onClose();
    onCreated();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Create Email Campaign</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campaign Name */}
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Campaign Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Description */}
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {/* Template Multi select */}
          <div>
            <p>Select Email Template</p>
            <Select
              options={templateOptions}
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
              className="w-full border rounded px-3 py-2 mb-1"
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
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
