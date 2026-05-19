import { Link } from "react-router-dom";

const steps = [
  "Upload certificate PDF",
  "Generate SHA-256 hash",
  "Match hash with database + blockchain",
  "Show trusted verification result"
];

const LandingPage = () => {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <section className="glass-card relative overflow-hidden p-8 md:p-12">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-teal-300/25 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-2">
          <div>
            <p className="mb-2 inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-800">
              Blockchain Certificate Security
            </p>
            <h1 className="font-heading text-4xl font-extrabold text-slate-900 md:text-5xl">
              BlockCertify
            </h1>
            <p className="mt-3 text-lg font-semibold text-slate-700">
              Verify Certificates. Prevent Fraud. Trust Blockchain.
            </p>
            <p className="mt-4 max-w-xl text-slate-600">
              College authorities issue certificates with tamper-proof hashes, students access their records, and the
              public can instantly verify authenticity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/verify" className="btn-primary">
                Verify Certificate
              </Link>
              <Link to="/login?role=admin" className="btn-secondary">
                Admin Login
              </Link>
              <Link to="/login?role=student" className="btn-secondary">
                Student Login
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-slate-900 p-6 text-slate-50 shadow-xl">
            <h2 className="font-heading text-xl font-bold">How Verification Works</h2>
            <ol className="mt-5 space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-slate-200">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
