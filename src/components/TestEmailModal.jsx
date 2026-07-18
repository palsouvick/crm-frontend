import React, { useState } from "react";

const TestEmailModal = ({
  isOpen,
  onClose,
  onSend,
  template,
  loading,
}) => {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">📧 Send Test Email</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-auto">
          
          {/* Subject */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Subject</p>
            <p className="font-medium">{template?.subject}</p>
          </div>

          {/* Email Body Preview */}
          <div className="border rounded bg-gray-50 p-4">
            <div
              dangerouslySetInnerHTML={{ __html: template?.body }}
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Test Email Address
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            disabled={!email || loading}
            onClick={() => onSend(email)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Test"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestEmailModal;
