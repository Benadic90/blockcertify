const badgeMap = {
  valid: "bg-emerald-100 text-emerald-800",
  fake: "bg-red-100 text-red-800",
  revoked: "bg-amber-100 text-amber-800",
  not_found: "bg-slate-200 text-slate-700",
  confirmed: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-amber-100 text-amber-800"
};

const StatusBadge = ({ status = "pending" }) => {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${badgeMap[status] || badgeMap.pending}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
};

export default StatusBadge;
