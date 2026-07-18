import { useEffect, useState } from "react";
import { Download, Upload, CheckCircle2, AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const SAMPLE_CSV = [
  "Name,Email,Phone,Password,Role,Status,Department,Designation,Employee ID,Joining Date",
  "John Doe,john.doe@example.com,9876543210,Passw0rd!,sales,active,Sales,Sales Executive,EMP1001,2026-01-15",
].join("\n");

const downloadSampleCsv = () => {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "users-import-sample.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};

const ImportUsersModal = ({ isOpen, onClose, onImport, isSubmitting }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setResult(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    try {
      const data = await onImport(file);
      setResult(data);
    } catch (error) {
      setResult({ createdCount: 0, skippedCount: 0, errors: [{ message: "Import failed. Please try again." }] });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Users"
      description="Bulk-create users from a CSV file."
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!file}>
            Upload &amp; Import
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={downloadSampleCsv}
          className="flex items-center gap-2 text-body text-primary-600 hover:underline"
        >
          <Download size={16} aria-hidden="true" />
          Download sample CSV template
        </button>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="user-import-file"
            className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-control p-6 text-center cursor-pointer hover:bg-surface-hover"
          >
            <Upload size={20} className="text-ink-subtle" aria-hidden="true" />
            <span className="text-body text-ink-muted">
              {file ? file.name : "Click to choose a CSV file"}
            </span>
            <input
              id="user-import-file"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </form>

        {result && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="flex items-center gap-2 text-body text-ink">
              <CheckCircle2 size={16} className="text-success-600" aria-hidden="true" />
              {result.createdCount} user{result.createdCount === 1 ? "" : "s"} created
              {result.skippedCount > 0 && `, ${result.skippedCount} skipped`}
            </p>
            {result.errors?.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1">
                {result.errors.map((err, i) => (
                  <p key={i} className="flex items-start gap-2 text-caption text-ink-muted">
                    <AlertTriangle size={14} className="text-warning-600 mt-0.5 shrink-0" aria-hidden="true" />
                    {err.row ? <Badge variant="neutral" size="sm">Row {err.row}</Badge> : null}
                    <span>{err.email ? `${err.email} — ` : ""}{err.message}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportUsersModal;
