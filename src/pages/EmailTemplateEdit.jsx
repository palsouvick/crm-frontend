import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import {
  getEmailTemplateById,
  updateEmailTemplate,
} from "../api/emailTemplateApi";
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
import { toast } from "react-hot-toast";
import TestEmailModal from "../components/TestEmailModal";
import EmailTemplateView from "../components/EmailTemplateView";

// EDIT PAGE COMPONENT
const EmailTemplateEdit = () => {
  const fileInputRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    category: "general",
    tags: [],
    preheader: "",
    attachments: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState({});
  const [newTag, setNewTag] = useState("");

  const categories = [
    { value: "general", label: "General" },
    { value: "welcome", label: "Welcome/Onboarding" },
    { value: "followup", label: "Follow-up" },
    { value: "proposal", label: "Proposal/Quote" },
    { value: "reminder", label: "Reminder" },
    { value: "newsletter", label: "Newsletter" },
    { value: "promotion", label: "Promotion/Offer" },
    { value: "feedback", label: "Feedback Request" },
    { value: "renewal", label: "Renewal/Subscription" },
    { value: "abandoned", label: "Abandoned Cart" },
  ];

  const mergeFields = [
    {
      tag: "{{contact.firstName}}",
      description: "Contact's first name",
      icon: User,
    },
    {
      tag: "{{contact.lastName}}",
      description: "Contact's last name",
      icon: User,
    },
    { tag: "{{contact.email}}", description: "Contact's email", icon: Mail },
    { tag: "{{contact.company}}", description: "Company name", icon: Building },
    {
      tag: "{{deal.name}}",
      description: "Deal/Opportunity name",
      icon: FileText,
    },
    { tag: "{{deal.value}}", description: "Deal value", icon: DollarSign },
    { tag: "{{user.name}}", description: "Your name", icon: User },
    {
      tag: "{{company.name}}",
      description: "Your company name",
      icon: Building,
    },
  ];

  // Fetch template data
  useEffect(() => {
    if (!templateId) return;
    const fetchTemplate = async () => {
      setFetchLoading(true);
      try {
        // Simulate API call - replace with actual API
        const res = await getEmailTemplateById(templateId);

        const template = res.data.data;
        const isActive =
          template.isActive === true || template.isActive === "true";

        console.log("Template data received:", template);

        setForm({
          name: template.name || "",
          subject: template.subject || "",
          body: template.body || "",
          category: template.category || "general",
          tags: template.tags || [],
          preheader: template.preheader || "",
          attachments: template.attachments || [],
          isActive: template.isActive || true,
        });
      } catch (err) {
        console.error("Error fetching template:", err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      file: file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));

    setForm({
      ...form,
      attachments: [...form.attachments, ...newAttachments],
    });
  };

  const removeAttachment = (index) => {
    const newAttachments = form.attachments.filter((_, i) => i !== index);
    setForm({ ...form, attachments: newAttachments });
  };

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm({ ...form, tags: [...form.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) });
  };

  const insertMergeField = (tag) => {
    setForm({ ...form, body: form.body + " " + tag });
  };

  const validateForm = () => {
    const arr = {};
    if (!form.name) arr.name = "Name is required.";
    if (!form.subject) arr.subject = "Subject is required.";
    if (!form.body) arr.body = "Body is required.";
    setError(arr);
    return Object.keys(arr).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }
      console.log("Updated template data:", form);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      alert("Template updated successfully!");
    } catch (err) {
      setLoading(false);
      console.error("Error updating email template:", err);
    }
  };

  const toggleActive = () => {
    setForm({ ...form, isActive: !form.isActive });
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="border-b p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/email-templates")}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Edit Email Template
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Template ID: {templateId}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={toggleActive}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      form.isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-50 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {form.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                    {form.isActive ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-6">
                  {/* Template Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-2 text-gray-700">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {error.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-medium mb-2 text-gray-700">
                        Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">
                      Tags
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Add tag..."
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-indigo-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    {error.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.subject}
                      </p>
                    )}
                  </div>

                  {/* Preheader */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">
                      Preheader Text
                      <span className="text-sm text-gray-500 ml-2">
                        (Preview text shown in inbox)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="preheader"
                      value={form.preheader}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">
                      Email Body *
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <textarea
                        name="body"
                        value={form.body}
                        onChange={handleChange}
                        rows="14"
                        className="w-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      />
                    </div>
                    {error.body && (
                      <p className="text-red-500 text-sm mt-1">{error.body}</p>
                    )}
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">
                      Attachments
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload files
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />

                    {form.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {form.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            {file.preview && (
                              <img
                                src={file.preview}
                                alt={file.filename}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.fileSize
                                  ? `${(file.fileSize / 1024).toFixed(2)} KB`
                                  : "Unknown size"}
                              </p>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button className="border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Merge Fields
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Click to insert</p>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {mergeFields.map((field, index) => {
                      const Icon = field.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => insertMergeField(field.tag)}
                          className="w-full text-left p-3 bg-white rounded-lg hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <Icon className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-mono text-indigo-600 break-all">
                                {field.tag}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                {field.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <EmailTemplateView
            template={form}
            onClose={() => setShowPreview(false)}
          />
        )}
    </>
  );
};

// PREVIEW COMPONENT

export default EmailTemplateEdit;
