import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
      <div className="md:col-span-6 lg:col-span-8">
        <Card className="h-full">
          <Skeleton variant="text" width="40%" className="mb-3" />
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="text" width="80%" />
        </Card>
      </div>
      <div className="md:col-span-6 lg:col-span-4">
        <Card className="h-full">
          <Skeleton variant="text" width="50%" className="mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="text" className="mb-3" />
          ))}
        </Card>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="md:col-span-3 lg:col-span-4">
          <Card>
            <Skeleton variant="circle" width={40} height={40} className="mb-4" />
            <Skeleton variant="text" width="60%" className="mb-2" />
            <Skeleton variant="text" width="40%" />
          </Card>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
      <div className="md:col-span-6 lg:col-span-8">
        <Skeleton height={280} />
      </div>
      <div className="md:col-span-6 lg:col-span-4">
        <Skeleton height={280} />
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
