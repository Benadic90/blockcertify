import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";
import { formatDate } from "../utils/format";

const CertificateDetailPage = () => {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/verify/${certificateId}`);
        setData(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to fetch certificate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [certificateId]);

  if (loading) return <LoadingSpinner label="Loading certificate details..." />;
  if (!data?.certificate) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <section className="glass-card p-6">
          <h1 className="font-heading text-2xl font-bold">Certificate Not Found</h1>
          <p className="mt-2 text-slate-600">No record available for {certificateId}.</p>
        </section>
      </main>
    );
  }

  const cert = data.certificate;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
      <section className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold">Certificate Details</h1>
          <StatusBadge status={data.result} />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Detail label="Certificate ID" value={cert.certificateId} />
          <Detail label="Student Name" value={cert.studentName} />
          <Detail label="Student Email" value={cert.studentEmail} />
          <Detail label="Student ID" value={cert.studentId} />
          <Detail label="Course Name" value={cert.courseName} />
          <Detail label="Event Name" value={cert.eventName || "-"} />
          <Detail label="Issue Date" value={formatDate(cert.issueDate)} />
          <Detail label="Issuer" value={cert.issuerName} />
          <Detail label="Hash" value={cert.certificateHash} />
          <Detail label="Blockchain Tx Hash" value={cert.blockchainTxHash || "-"} />
          <Detail label="Blockchain Status" value={cert.blockchainStatus} />
          <Detail label="Revoked" value={cert.isRevoked ? "Yes" : "No"} />
        </div>
      </section>
    </main>
  );
};

const Detail = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
    <p className="text-xs uppercase text-slate-500">{label}</p>
    <p className="mt-1 break-all text-sm font-semibold text-slate-800">{value}</p>
  </div>
);

export default CertificateDetailPage;
