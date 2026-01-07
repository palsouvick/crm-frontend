import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from '../components/Layout'
import { getEmailTemplateById } from "../api/emailTemplateApi";

const EmailTemplateView = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState({});

    useEffect(() => {
        const fetchEmailTemplate = async () => {
            try {
                console.log("Fetching lead with ID:", id);
                const res = await getEmailTemplateById(id);
                setTemplate(res.data);
                console.log("Lead data received:", res.data);
            } catch (error) {
                console.error("Fecth failed", error);
            }
        };
        fetchEmailTemplate();
    }, [id]);
  return (
    <Layout>
      <div className="bg-white p-4 rounded shadow h-full">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Email Preview</h1>
          <button
            onClick={() => navigate("/email-templates")}
            className="bg-blue-600 rounded px-3.5 py-1.5"
          >
            Back
          </button>
        </div>

        <div className="border rounded p-4 max-w-[600px] mx-auto bg-gray-50">
          <h2 className="font-semibold mb-2">
            Subject: {template.subject}
          </h2>

          <div
            className="bg-white p-3 border rounded"
            dangerouslySetInnerHTML={{ __html: template.body }}
          />
        </div>
      </div>
    </Layout>
  )
}

export default EmailTemplateView