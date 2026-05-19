import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import CertificateTable from "../components/CertificateTable";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import api, { getPublicFileUrl } from "../services/api";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCertificates = async () => {
    try {
      const { data } = await api.get("/api/student/certificates");
      setCertificates(data.certificates);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load certificates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  if (loading) return <LoadingSpinner label="Loading student dashboard..." />;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <section className="glass-card p-6">
        <h1 className="font-heading text-2xl font-bold text-slate-900">Student Profile</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Name</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Email</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Student ID</p>
            <p className="font-semibold">{user?.studentId || "-"}</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-6">
        <h2 className="font-heading text-xl font-bold text-slate-900">My Certificates</h2>
        <div className="mt-4">
          <CertificateTable certificates={certificates} />
        </div>

        <div className="mt-5 space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.certificateId}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{cert.certificateId}</p>
                <p className="text-sm text-slate-600">{cert.courseName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  className="btn-secondary py-1 text-xs"
                  href={getPublicFileUrl(cert.pdfPath)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download PDF
                </a>
                <button
                  type="button"
                  className="btn-secondary py-1 text-xs"
                  onClick={() => navigator.clipboard.writeText(cert.certificateId)}
                >
                  Copy Certificate ID
                </button>
                <Link className="btn-primary py-1 text-xs" to={`/verify?certificateId=${cert.certificateId}`}>
                  Verification Link
                </Link>
              </div>
            </div>
          ))}
          {certificates.length === 0 && <p className="text-sm text-slate-500">No certificates issued yet.</p>}
        </div>
      </section>
    </main>
  );
};

export default StudentDashboard;
