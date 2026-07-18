import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { createEmailTemplate } from "../api/emailTemplateApi";
import JoditEditor from "jodit-react";
import { Upload, X, Tag, User, Calendar, DollarSign, Building, Mail, FileText, Eye } from "lucide-react";


const EmailTemplateCreate = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    category: "general",
    tags: [],
    preheader: "",
    attachments: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [newTag, setNewTag] = useState("");

    // CRM Template Categories
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

    // CRM Merge Fields/Variables
  const mergeFields = [
    { tag: "{{contact.firstName}}", description: "Contact's first name", icon: User },
    { tag: "{{contact.lastName}}", description: "Contact's last name", icon: User },
    { tag: "{{contact.email}}", description: "Contact's email", icon: Mail },
    { tag: "{{contact.company}}", description: "Company name", icon: Building },
    { tag: "{{contact.phone}}", description: "Phone number", icon: User },
    { tag: "{{deal.name}}", description: "Deal/Opportunity name", icon: FileText },
    { tag: "{{deal.value}}", description: "Deal value", icon: DollarSign },
    { tag: "{{deal.closeDate}}", description: "Expected close date", icon: Calendar },
    { tag: "{{user.name}}", description: "Your name", icon: User },
    { tag: "{{user.signature}}", description: "Your email signature", icon: Mail },
    { tag: "{{company.name}}", description: "Your company name", icon: Building },
  ];
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type,
      file: file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setForm({
      ...form,
      attachments: [...form.attachments, ...newAttachments]
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
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
  };

  const insertMergeField = (tag) => {
    setForm({ ...form, body: form.body + " " + tag });
  };
  const validateForm = () => {
    const arr = {};
    if (!form.name) {
      arr.name = "Name is required.";
    }
    if (!form.subject) {
      arr.subject = "Subject is required.";
    }
    if (!form.body) {
      arr.body = "Body is required.";
    }
    setError(arr);
    return Object.keys(arr).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }
      await createEmailTemplate(form);
      setLoading(false);
      navigate("/email-templates");
    } catch (err) {
      setLoading(false);
      console.error("Error creating email template:", err);
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="border-b p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Create Email Template</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-6">
                {/* Template Name & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Template Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Welcome Email"
                    />
                    {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
                  </div>

                  <div>
                    <label className="block font-medium mb-2 text-gray-700">Category</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
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
                  <label className="block font-medium mb-2 text-gray-700">Email Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Welcome to {{company.name}}, {{contact.firstName}}!"
                  />
                  {error.subject && <p className="text-red-500 text-sm mt-1">{error.subject}</p>}
                </div>

                {/* Preheader */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">
                    Preheader Text
                    <span className="text-sm text-gray-500 ml-2">(Preview text shown in inbox)</span>
                  </label>
                  <input
                    type="text"
                    name="preheader"
                    value={form.preheader}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Get started with your account in 3 easy steps..."
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Email Body *</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <textarea
                      name="body"
                      value={form.body}
                      onChange={handleChange}
                      rows="12"
                      className="w-full px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Hi {{contact.firstName}},&#10;&#10;Welcome to {{company.name}}! We're excited to have you on board.&#10;&#10;Best regards,&#10;{{user.name}}"
                    />
                  </div>
                  {error.body && <p className="text-red-500 text-sm mt-1">{error.body}</p>}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Attachments</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">Images, PDFs, or documents</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  
                  {/* Attachment List */}
                  {form.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {form.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {file.preview && (
                            <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
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
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? "Saving..." : "Save Template"}
                  </button>
                  <button
                    onClick={() => window.history.back()}
                    className="border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6">
              {/* Merge Fields */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Merge Fields</h3>
                <p className="text-sm text-gray-600 mb-4">Click to insert personalization variables</p>
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
                            <p className="text-xs font-mono text-indigo-600 break-all">{field.tag}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{field.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Best Practices</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Use merge fields for personalization</li>
                  <li>• Keep subject lines under 50 characters</li>
                  <li>• Add preheader text to increase open rates</li>
                  <li>• Test your template before sending</li>
                  <li>• Use clear call-to-action buttons</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Email Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Subject:</p>
                  <p className="font-semibold">{form.subject || "No subject"}</p>
                </div>
                {form.preheader && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Preheader:</p>
                    <p className="text-sm text-gray-700">{form.preheader}</p>
                  </div>
                )}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="whitespace-pre-wrap">{form.body || "No content"}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmailTemplateCreate;
