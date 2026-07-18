import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import Button from "../ui/Button";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

const AssignRoleModal = ({ isOpen, user, onClose, onSubmit, isSubmitting }) => {
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (isOpen) setRole(user?.role || "user");
  }, [isOpen, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(role);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Role"
      description={user ? `Change the role for ${user.name}` : undefined}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Save Role
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Select options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value)} />
      </form>
    </Modal>
  );
};

export default AssignRoleModal;
