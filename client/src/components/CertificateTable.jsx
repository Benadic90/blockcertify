import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";
import { formatDate, shorten } from "../utils/format";

const CertificateTable = ({ certificates = [], onRevoke, showActions = false }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100/80">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-slate-600">Certificate ID</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600">Student</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600">Course/Event</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600">Issue Date</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600">Status</th>
            <th className="px-3 py-2 text-left font-semibold text-slate-600">Tx Hash</th>
            {showActions && <th className="px-3 py-2 text-left font-semibold text-slate-600">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {certificates.length === 0 && (
            <tr>
              <td className="px-3 py-4 text-slate-500" colSpan={showActions ? 7 : 6}>
                No certificates found.
              </td>
            </tr>
          )}
          {certificates.map((cert) => (
            <tr key={cert._id || cert.certificateId}>
              <td className="px-3 py-2">
                <Link className="font-semibold text-teal-700 hover:underline" to={`/certificate/${cert.certificateId}`}>
                  {cert.certificateId}
                </Link>
              </td>
              <td className="px-3 py-2">
                <p className="font-medium">{cert.studentName}</p>
                <p className="text-xs text-slate-500">{cert.studentEmail}</p>
              </td>
              <td className="px-3 py-2">
                <p>{cert.courseName}</p>
                <p className="text-xs text-slate-500">{cert.eventName || "—"}</p>
              </td>
              <td className="px-3 py-2">{formatDate(cert.issueDate)}</td>
              <td className="px-3 py-2">
                <StatusBadge status={cert.isRevoked ? "revoked" : cert.blockchainStatus} />
              </td>
              <td className="px-3 py-2 text-xs text-slate-600">
                {cert.blockchainTxHash ? shorten(cert.blockchainTxHash, 10, 8) : "—"}
              </td>
              {showActions && (
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn-secondary py-1 text-xs"
                      onClick={() => navigator.clipboard.writeText(cert.certificateId)}
                    >
                      Copy ID
                    </button>
                    {!cert.isRevoked && (
                      <button type="button" className="btn-primary py-1 text-xs" onClick={() => onRevoke(cert)}>
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateTable;
