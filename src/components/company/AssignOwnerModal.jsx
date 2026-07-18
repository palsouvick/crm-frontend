import { useEffect, useState } from "react";
import Select from "react-select";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const AssignOwnerModal = ({
  isOpen,
  company,
  count,
  initialOwnerIds = [],
  userOptions,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [ownerIds, setOwnerIds] = useState([]);

  useEffect(() => {
    if (isOpen) setOwnerIds(initialOwnerIds);
  }, [isOpen, initialOwnerIds]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(ownerIds);
  };

  const title = company ? `Assign Owner(s) — ${company.name}` : `Assign Owner(s) to ${count} companies`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
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
        <Select
          isMulti
          options={userOptions}
          value={userOptions.filter((opt) => ownerIds.includes(opt.value))}
          onChange={(selected) => setOwnerIds(selected ? selected.map((s) => s.value) : [])}
          placeholder="Select owner(s)..."
        />
      </form>
    </Modal>
  );
};

export default AssignOwnerModal;
