const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <h2 className="text-3xl font-bold text-gray-800 mt-1">
          {value}
        </h2>
      </div>

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${color}`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
