import { motion } from "framer-motion";
import Card from "../ui/Card";
import { fadeIn } from "../../lib/motion";

const getGreeting = (hour) => {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const DashboardHero = ({ userName, followUpsCount = 0, leadsCount = 0 }) => {
  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeLabel = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div {...fadeIn}>
      <Card className="h-full flex flex-col justify-between">
        <div>
          <p className="text-caption text-ink-subtle">
            {dateLabel} &middot; {timeLabel}
          </p>
          <h1 className="text-h2 font-bold text-ink mt-1">
            {greeting}, {userName || "there"}
          </h1>
          <p className="text-body text-ink-muted mt-2">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <span className="text-body text-ink">
            You have <strong className="text-primary-600">{followUpsCount}</strong>{" "}
            follow-ups pending and <strong className="text-primary-600">{leadsCount}</strong>{" "}
            active leads.
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export default DashboardHero;
