import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import JoditEditor from "jodit-react";
import {
  getEmailTemplateById,
  updateEmailTemplate,
} from "../api/emailTemplateApi";

const EmailTemplateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
  });

  const config = {
    height: 350,
    uploader: { insertImageAsBase64URI: true },
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  const fetchTemplate = async () => {
    const res = await getEmailTemplateById(id);
    setForm({
      name: res.data.name,
      subject: res.data.subject,
      body: res.data.body,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateEmailTemplate(id, form);
    navigate("/email-templates");
  };

  return (
    <Layout>
        <div className="bg-white p-4 rounded shadow h-full">
            <div className="flex justify-between">
      <h1 className="text-2xl font-bold mb-3">Edit Email Template</h1>
      <button
            onClick={() => navigate("/email-templates")}
            className="bg-blue-600 rounded px-3.5 py-1.5"
          >
            Back
          </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded">
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <input
          name="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />

        <JoditEditor
          ref={editor}
          value={form.body}
          config={config}
          onBlur={(content) => setForm({ ...form, body: content })}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
      </div>
    </Layout>
  );
};

export default EmailTemplateEdit;
