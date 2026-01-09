const EmptyState = ({
  icon = "📭",
  title,
  description,
  actionText,
  onAction,
  navigateTo,
  height = "h-56",
}) => {
  return (
    <div className={`${height} flex flex-col items-center justify-center text-gray-500`}>
      <div className="text-5xl mb-3">{icon}</div>

      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>

      <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">
        {description}
      </p>

      {(onAction || navigateTo) && (
        <button
          onClick={() => {
            if (onAction) onAction();
            if (navigateTo) navigateTo();
          }}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
