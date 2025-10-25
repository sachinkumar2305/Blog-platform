export const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  if (!children) return null;
  return <p className="text-sm text-red-600 mt-1">{children}</p>;
};

export const FormField = ({
  label,
  error,
  children,
  required,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
};