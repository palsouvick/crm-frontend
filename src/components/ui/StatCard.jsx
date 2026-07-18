import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import Card from "./Card";
import Skeleton from "./Skeleton";
import Sparkline from "./Sparkline";
import { fadeIn } from "../../lib/motion";

const accentClasses = {
  primary: "bg-primary-100 text-primary-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  info: "bg-info-100 text-info-700",
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  accent = "primary",
  trend,
  sparklineData,
  isLoading = false,
  onClick,
}) => {
  if (isLoading) {
    return (
      <Card>
        <Skeleton variant="circle" width={40} height={40} className="mb-4" />
        <Skeleton variant="text" width="60%" className="mb-2" />
        <Skeleton variant="text" width="40%" />
      </Card>
    );
  }

  const isPositive = trend !== undefined && trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div {...fadeIn}>
      <Card
        role="group"
        aria-label={`${title}: ${value}`}
        onClick={onClick}
        className={clsx(
          "transition-shadow hover:shadow-md",
          onClick && "cursor-pointer"
        )}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <div className="flex items-start justify-between">
          <div
            className={clsx(
              "w-10 h-10 rounded-control flex items-center justify-center",
              accentClasses[accent]
            )}
          >
            {Icon && <Icon size={20} aria-hidden="true" />}
          </div>
          {trend !== undefined && (
            <span
              className={clsx(
                "flex items-center gap-1 text-caption font-medium",
                isPositive ? "text-success-700" : "text-danger-700"
              )}
            >
              <TrendIcon size={14} aria-hidden="true" />
              <span className="sr-only">{isPositive ? "up" : "down"}</span>
              {Math.abs(trend)}%
            </span>
          )}
        </div>

        <p className="text-body text-ink-muted mt-4 min-h-10 line-clamp-2">{title}</p>
        <p className="text-h3 font-bold text-ink mt-1">{value}</p>

        {sparklineData && sparklineData.length > 1 && (
          <div className="mt-3 -mx-1">
            <Sparkline data={sparklineData} />
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default memo(StatCard);
