import React from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { createEmailTemplate } from "../api/emailTemplateApi";
import JoditEditor from "jodit-react";

const EmailTemplateCreate = () => {
  const config = {
    readonly: false,
    height: 350,
    uploader: {
      insertImageAsBase64URI: true, // simple & works instantly
    },
    toolbarAdaptive: false,
  };
  const editor = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    <Layout>
      <div className=" bg-white p-4 rounded shadow h-full">
        <div className="flex justify-between">
        <h1 className="font-bold text-2xl mb-2 cursor-pointer">Create Email Template</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg" onClick={() => navigate("/email-templates")}>Back</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Template Name */}
          <div>
            <label className="block font-medium mb-1">Template Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Welcome Email"
            />
            {error && error.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block font-medium mb-1">Email Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Welcome to our platform"
            />
            {error && error.subject && (
              <p className="text-red-500 text-sm mt-1">{error.subject}</p>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block font-medium mb-1">Email Body</label>
            <JoditEditor
              onBlur={(newContent) => setForm({ ...form, body: newContent })}
              ref={editor}
              value={form.body}
              config={config}
            />
            {error && error.body && (
              <p className="text-red-500 text-sm mt-1">{error.body}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded"
            >
              {loading ? "Saving..." : "Save Template"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/email-templates")}
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
        
      </div>
    </Layout>
  );
};

export default EmailTemplateCreate;
