import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

const resultStyle = {
  valid: "bg-emerald-100 border-emerald-300 text-emerald-900",
  fake: "bg-red-100 border-red-300 text-red-900",
  revoked: "bg-amber-100 border-amber-300 text-amber-900",
  not_found: "bg-slate-100 border-slate-300 text-slate-900"
};

const resultLabel = {
  valid: "Valid Certificate ✅",
  fake: "Fake or Modified Certificate ❌",
  revoked: "Revoked Certificate ⚠️",
  not_found: "Certificate Not Found ❌"
};

const PublicVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(searchParams.get("certificateId") || "");
  const [certificateHash, setCertificateHash] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (searchParams.get("certificateId")) {
      setCertificateId(searchParams.get("certificateId"));
    }
  }, [searchParams]);

  const statusClass = useMemo(
    () => (result ? resultStyle[result.result] || resultStyle.not_found : "bg-slate-100 border-slate-300"),
    [result]
  );

  const verifyByUpload = async (event) => {
    event.preventDefault();
    if (!pdfFile) {
      toast.error("Upload a certificate PDF first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("certificatePdf", pdfFile);

    try {
      const { data } = await api.post("/api/verify/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(data);
      toast.success("Verification completed.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const verifyByIdOrHash = async (event) => {
    event.preventDefault();
    if (!certificateId && !certificateHash) {
      toast.error("Enter certificate ID or hash.");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (certificateId && !certificateHash) {
        ({ data } = await api.get(`/api/verify/${certificateId}`));
      } else {
        ({ data } = await api.post("/api/verify/hash", { certificateId, certificateHash }));
      }
      setResult(data);
      toast.success("Verification completed.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 md:px-6">
      <section className="glass-card p-6">
        <h1 className="font-heading text-3xl font-bold">Public Certificate Verification</h1>
        <p className="mt-2 text-slate-600">
          Upload certificate PDF or enter certificate ID/hash to validate authenticity.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h2 className="font-heading text-xl font-bold">Option 1: Upload PDF</h2>
          <form className="mt-4 space-y-3" onSubmit={verifyByUpload}>
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => setPdfFile(event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-white"
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify Uploaded Certificate"}
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <h2 className="font-heading text-xl font-bold">Option 2: Verify by ID / Hash</h2>
          <form className="mt-4 space-y-3" onSubmit={verifyByIdOrHash}>
            <input
              type="text"
              value={certificateId}
              onChange={(event) => setCertificateId(event.target.value)}
              placeholder="Certificate ID (e.g. BC-20260830-ABC123)"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <textarea
              value={certificateHash}
              onChange={(event) => setCertificateHash(event.target.value)}
              placeholder="Certificate SHA-256 Hash (optional if ID is provided)"
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify by ID / Hash"}
            </button>
          </form>
        </div>
      </section>

      {result && (
        <section className={`rounded-2xl border p-6 ${statusClass}`}>
          <h3 className="font-heading text-2xl font-bold">{resultLabel[result.result] || "Verification Result"}</h3>
          <p className="mt-2 text-sm">{result.message}</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-white/70 p-4">
              <p className="text-xs uppercase text-slate-600">Uploaded Hash</p>
              <p className="mt-1 break-all text-sm font-medium">{result.uploadedHash || "Not provided"}</p>
            </div>
            <div className="rounded-xl bg-white/70 p-4">
              <p className="text-xs uppercase text-slate-600">Certificate ID</p>
              <p className="mt-1 text-sm font-medium">{result.certificate?.certificateId || "Not found"}</p>
            </div>
          </div>

          {result.certificate?.certificateId && (
            <Link to={`/certificate/${result.certificate.certificateId}`} className="mt-4 inline-block text-sm font-bold underline">
              View Certificate Details
            </Link>
          )}
        </section>
      )}
    </main>
  );
};

export default PublicVerifyPage;
