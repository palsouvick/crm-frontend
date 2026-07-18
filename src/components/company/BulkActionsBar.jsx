import { motion } from "framer-motion";
import { Users, RefreshCw, Trash2, Download, X } from "lucide-react";
import Button from "../ui/Button";
import { slideDown } from "../../lib/motion";

const BulkActionsBar = ({
  selectedCount,
  onAssignOwner,
  onChangeStatus,
  onDelete,
  onExportSelected,
  onClear,
  isBusy,
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div {...slideDown}>
      <div className="bg-primary-50 border border-primary-200 rounded-panel p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-body font-medium text-ink">
          {selectedCount} selected on this page
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Users size={16} />}
            onClick={onAssignOwner}
            disabled={isBusy}
          >
            Assign Owner
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw size={16} />}
            onClick={onChangeStatus}
            disabled={isBusy}
          >
            Change Status
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={16} />}
            onClick={onExportSelected}
            disabled={isBusy}
          >
            Export
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={onDelete}
            disabled={isBusy}
          >
            Delete
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<X size={16} />} onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BulkActionsBar;
