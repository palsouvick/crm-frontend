import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import PasswordInput from "./ui/PasswordInput";
import DateInput from "./ui/DateInput";
import Select from "./ui/Select";
import FieldError from "./ui/FieldError";
import Button from "./ui/Button";

const ROLE_OPTIONS = [
  { value: "", label: "Select Role" },
  { value: "user", label: "User" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Select Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  dob: "",
  role: "",
  status: "",
};

const UserModal = ({ isOpen, onClose, onSubmit, user, serverErrors: backendErrors }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
      dob: user?.dob ? user.dob.slice(0, 10) : "",
      role: user?.role || "",
      status: user?.status || "",
    });
    setErrors({});
  }, [user, isOpen]);

  useEffect(() => {
    if (backendErrors) {
      setErrors((prev) => ({ ...prev, ...backendErrors }));
    }
  }, [backendErrors]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!user && !form.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!form.role.trim()) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Add User"}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} error={Boolean(errors.name)} />
          <FieldError message={errors.name} />
        </div>
        <div>
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} error={Boolean(errors.phone)} />
          <FieldError message={errors.phone} />
        </div>
        {!user && (
          <div>
            <PasswordInput
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={Boolean(errors.password)}
            />
            <FieldError message={errors.password} />
          </div>
        )}
        <div>
          <DateInput
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
          <FieldError message={errors.dob} />
        </div>
        <Select name="status" options={STATUS_OPTIONS} value={form.status} onChange={handleChange} />
        <div>
          <Select name="role" options={ROLE_OPTIONS} value={form.role} onChange={handleChange} error={Boolean(errors.role)} />
          <FieldError message={errors.role} />
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
