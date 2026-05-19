const StatCard = ({ label, value, tone = "teal" }) => {
  const toneClass = {
    teal: "from-teal-500/20 to-teal-100",
    sky: "from-sky-500/20 to-sky-100",
    amber: "from-amber-500/20 to-amber-100",
    rose: "from-rose-500/20 to-rose-100"
  };

  return (
    <div className={`glass-card bg-gradient-to-br ${toneClass[tone] || toneClass.teal} p-5`}>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default StatCard;
