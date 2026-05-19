const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-14">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-card">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
