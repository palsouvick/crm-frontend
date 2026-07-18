import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, History } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const CompanyTimelinePlaceholder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate("/company")}>
        Back to Companies
      </Button>

      <Card className="flex flex-col items-center text-center py-16">
        <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
          <History size={28} aria-hidden="true" />
        </div>
        <h1 className="text-h3 font-semibold text-ink">Company Timeline</h1>
        <p className="text-body text-ink-muted mt-2 max-w-md">
          The full activity timeline — status changes, linked contacts, leads, follow-ups and more — is
          coming soon for this company.
        </p>
      </Card>
    </div>
  );
};

export default CompanyTimelinePlaceholder;
