import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deleteEmailTemplate, getEmailTemplates } from "../api/emailTemplateApi";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EmailTemplateView from "../components/EmailTemplateView";

const EmailTemplate = () => {
  const Navigate = useNavigate();
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const fetchEmailTemplate = async () => {
    try {
      setLoading(true);
      const res = await getEmailTemplates(
        page,
        limit,
        search,
      );
      console.log(res.data);
      setEmailTemplate(res.data.data);
      setTotalPages(res.data.pagination.pages);
      setLoading(false);
      const previewTemplate = Array.isArray(res.data.data)
      ? res.data.data[0]
      : res.data.data;
      console.log("Preview template:", previewTemplate);
      setPreviewTemplate(previewTemplate);
    } catch (error) {
      setLoading(false);
      console.error("Fecth failed", error);
    }
  };
  useEffect(() => {
    fetchEmailTemplate();
  }, []);

  const TableSkeleton = ({ rows = 5, cols = 6 }) => (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteEmailTemplate(deleteTarget._id);
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchEmailTemplate();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleting(false);
    }
  }
  return (
    <Layout>
      <div className=" bg-white p-4 rounded shadow h-full">
        <h1 className="text-2xl font-bold mb-4">Email Templates</h1>
        <div className="flex mb-4 gap-2 justify-between">
          <div>
            <input
              className="border px-4 py-2 rounded-lg w-72 focus:ring-2 focus:ring-indigo-500"
              placeholder="Search customer..."
            />

            {/* <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 rounded py-2 ml-2 cursor-pointer"
            >
              Search
            </button> */}
          </div>
          <div className="flex justify-between mb-4">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              onClick={() => Navigate("/email-templates/create")}
            >
              + Add EMail Template
            </button>
          </div>
        </div>
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : emailTemplate.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    No customers found
                  </td>
                </tr>
              ) : (
                emailTemplate.map((t) => (
                  <tr key={t._id} className="border-t">
                    <td className="p-3">{t.name}</td>
                    <td className="p-3">{t.subject}</td>
                    <td className="p-3">
                      {t.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="p-3">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="space-x-2 text-center items-center">
                      <button className="bg-blue-600 rounded px-3.5 py-1.5" onClick={()=> Navigate(`/email-templates/${t._id}/edit`)}>
                        Edit
                      </button>
                      <button className="bg-indigo-500 rounded px-3.5 py-1.5" onClick={()=>{setShowPreview(true)}}>
                        View
                      </button>
                      <button
                        className="bg-red-600 rounded px-3.5 py-1.5"
                        onClick={() => {
                          setDeleteTarget(t);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </button>
                      <button className="bg-gray-600 rounded px-3.5 py-1.5">
                        Preview
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
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
        <ConfirmDeleteModal
          isOpen={deleteOpen}
          title="Delete Customer"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
          onCancel={() => {
            setDeleteOpen(false);
            setDeleteTarget(null);
          }}
          onConfirm={confirmDelete}
          loading={deleting}
        />
        {/* Preview Modal */}
              {showPreview && (
                <EmailTemplateView
                  template={previewTemplate}
                  onClose={() => setShowPreview(false)}
                />
              )}
      </div>
    </Layout>
  );
};

export default EmailTemplate;
