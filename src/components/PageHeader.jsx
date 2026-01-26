import React from "react";

const PageHeader = ({
  icon,
  title,
  subtitle,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            {icon}
            {title}
          </h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="flex gap-3">
          {secondaryActionText && (
            <button
              onClick={onSecondaryAction}
              className="bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 font-medium"
            >
              {secondaryActionText}
            </button>
          )}

          {primaryActionText && (
            <button
              onClick={onPrimaryAction}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 font-medium"
            >
              {primaryActionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
