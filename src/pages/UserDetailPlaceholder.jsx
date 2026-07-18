import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const UserDetailPlaceholder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate("/users")}>
        Back to Users
      </Button>

      <Card className="flex flex-col items-center text-center py-16">
        <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
          <UserRound size={28} aria-hidden="true" />
        </div>
        <h1 className="text-h3 font-semibold text-ink">User Profile</h1>
        <p className="text-body text-ink-muted mt-2 max-w-md">
          The full profile page — activity timeline, assigned leads &amp; customers, meetings,
          permissions and more — is coming soon for user {id}.
        </p>
      </Card>
    </div>
  );
};

export default UserDetailPlaceholder;
