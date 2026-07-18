import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Button from "../ui/Button";

const STATUS_OPTIONS = ["active", "inactive", "lead", "customer", "prospect"].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));

const BulkStatusModal = ({ isOpen, count, onClose, onSubmit, isSubmitting }) => {
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (isOpen) setStatus("active");
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(status);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Status"
      description={`Update the status for ${count} selected companies`}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Select options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
      </form>
    </Modal>
  );
};

export default BulkStatusModal;
