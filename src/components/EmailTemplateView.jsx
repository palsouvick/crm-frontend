import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmailTemplateById } from "../api/emailTemplateApi";
import {
  Upload,
  X,
  Tag,
  User,
  Calendar,
  DollarSign,
  Building,
  Mail,
  FileText,
  Eye,
  ArrowLeft,
  Save,
  Send,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import TestEmailModal from "./TestEmailModal";
import { sendTestEmail } from "../api/campaignApi";

const EmailTemplateView = ({ template, onClose }) => {
  const [viewMode, setViewMode] = useState("desktop"); // desktop, mobile
  const [showMergeValues, setShowMergeValues] = useState(true);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const isActive = template.isActive === true || template.isActive === "true";
  console.log("template -", template);
  
  // Sample merge field values for preview
  const sampleValues = {
    "{{contact.firstName}}": "John",
    "{{contact.lastName}}": "Doe",
    "{{contact.email}}": "john.doe@example.com",
    "{{contact.company}}": "Acme Corp",
    "{{deal.name}}": "Q1 Enterprise Deal",
    "{{deal.value}}": "$50,000",
    "{{user.name}}": "Sarah Johnson",
    "{{company.name}}": "Your Company",
  };

  const replaceMergeFields = (text) => {
    if (!showMergeValues) return text;

    let result = text ?? "";

    Object.entries(sampleValues).forEach(([key, value]) => {
      result = result.replace(
        new RegExp(key.replace(/[{}]/g, "\\$&"), "g"),
        value,
      );
    });
    return result;
  };

  const handleSendTest = async () => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Preview Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Email Preview
              </h2>
              <p className="text-sm text-gray-500 mt-1">{template.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Controls */}
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 border rounded-lg p-1">
              <button
                onClick={() => setViewMode("desktop")}
                className={`px-4 py-2 rounded ${
                  viewMode === "desktop"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`px-4 py-2 rounded ${
                  viewMode === "mobile"
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Mobile
              </button>
            </div>

            <button
              onClick={() => setShowMergeValues(!showMergeValues)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Tag className="w-4 h-4" />
              {showMergeValues ? "Show Merge Tags" : "Show Sample Values"}
            </button>

            <button
              onClick={() => {
                setTestModalOpen(true);
                setSendingTest(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ml-auto"
            >
              <Send className="w-4 h-4" />
              Send Test Email
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div
            className={`mx-auto bg-white shadow-lg ${
              viewMode === "mobile" ? "max-w-md" : "max-w-3xl"
            }`}
          >
            {/* Email Header */}
            <div className="bg-gray-50 border-b p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">From:</span>
                  <span className="text-sm font-medium">
                    {replaceMergeFields("{{user.name}}")} (
                    {replaceMergeFields("{{company.name}}")})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">To:</span>
                  <span className="text-sm">
                    {replaceMergeFields("{{contact.email}}")}
                  </span>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm font-bold text-gray-900">
                    {replaceMergeFields(template.subject)}
                  </div>
                  {template.preheader && (
                    <div className="text-xs text-gray-500 mt-1">
                      {replaceMergeFields(template.preheader)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {replaceMergeFields(template.body)}
                </div>
              </div>

              {/* Attachments Preview */}
              {template.attachments && template.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Attachments ({template.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {template.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {file.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.fileSize
                              ? `${(file.fileSize / 1024).toFixed(2)} KB`
                              : "Unknown size"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Email Footer */}
            <div className="bg-gray-50 border-t p-4 text-center">
              <p className="text-xs text-gray-500">
                This is a preview of your email template
              </p>
            </div>
          </div>
        </div>

        {/* Template Info Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category:</span>
              <span className="ml-2 font-medium text-gray-900 capitalize">
                {template.category}
              </span>
            </div>
            {template.tags && template.tags.length > 0 && (
              <div>
                <span className="text-gray-500">Tags:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {template.tags.join(", ")}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Status:</span>
              <span
                className={`ml-2 font-medium ${isActive ? "text-green-600" : "text-gray-600"}`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <TestEmailModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        onSend={handleSendTest}
        template={template}
        loading={sendingTest}
      />
    </div>
  );
};

export default EmailTemplateView;
