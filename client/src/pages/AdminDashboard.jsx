import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CertificateTable from "../components/CertificateTable";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import api from "../services/api";

const initialStudent = {
  name: "",
  email: "",
  studentId: "",
  password: "student123"
};

const initialCertificate = {
  studentName: "",
  studentEmail: "",
  studentId: "",
  courseName: "",
  eventName: "",
  issueDate: "",
  issuerName: "",
  certificatePdf: null
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    totalCertificates: 0,
    totalStudents: 0,
    totalVerifications: 0,
    revokedCertificates: 0
  });
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentForm, setStudentForm] = useState(initialStudent);
  const [certificateForm, setCertificateForm] = useState(initialCertificate);
  const [submittingStudent, setSubmittingStudent] = useState(false);
  const [submittingCertificate, setSubmittingCertificate] = useState(false);

  const fetchDashboard = async () => {
    try {
      const [summaryRes, studentsRes, certsRes] = await Promise.all([
        api.get("/api/admin/dashboard"),
        api.get("/api/admin/students"),
        api.get("/api/admin/certificates")
      ]);

      setSummary(summaryRes.data);
      setStudents(studentsRes.data.students);
      setCertificates(certsRes.data.certificates);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const studentOptions = useMemo(
    () =>
      students.map((student) => ({
        value: student.studentId,
        label: `${student.name} (${student.studentId})`,
        student
      })),
    [students]
  );

  const onStudentChange = (event) => {
    setStudentForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onCertificateChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "certificatePdf") {
      setCertificateForm((prev) => ({ ...prev, certificatePdf: files?.[0] || null }));
      return;
    }
    setCertificateForm((prev) => ({ ...prev, [name]: value }));
  };

  const applyStudentToCertificateForm = (selectedStudentId) => {
    const matched = studentOptions.find((option) => option.value === selectedStudentId)?.student;
    if (!matched) return;
    setCertificateForm((prev) => ({
      ...prev,
      studentName: matched.name,
      studentEmail: matched.email,
      studentId: matched.studentId
    }));
  };

  const submitStudent = async (event) => {
    event.preventDefault();
    setSubmittingStudent(true);
    try {
      const { data } = await api.post("/api/admin/students", studentForm);
      toast.success(`Student added. Default password: ${data.defaultPassword}`);
      setStudentForm(initialStudent);
      await fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student.");
    } finally {
      setSubmittingStudent(false);
    }
  };

  const submitCertificate = async (event) => {
    event.preventDefault();
    if (!certificateForm.certificatePdf) {
      toast.error("Please upload a PDF file.");
      return;
    }

    setSubmittingCertificate(true);
    const formData = new FormData();
    Object.entries(certificateForm).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    try {
      await api.post("/api/admin/certificates/issue", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Certificate issued successfully.");
      setCertificateForm(initialCertificate);
      await fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to issue certificate.");
    } finally {
      setSubmittingCertificate(false);
    }
  };

  const revokeCertificate = async (certificate) => {
    try {
      await api.put(`/api/admin/certificates/${certificate._id}/revoke`);
      toast.success("Certificate revoked.");
      await fetchDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke certificate.");
    }
  };

  if (loading) return <LoadingSpinner label="Loading admin dashboard..." />;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-6">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Certificates" value={summary.totalCertificates} tone="teal" />
        <StatCard label="Total Students" value={summary.totalStudents} tone="sky" />
        <StatCard label="Total Verifications" value={summary.totalVerifications} tone="amber" />
        <StatCard label="Revoked Certificates" value={summary.revokedCertificates} tone="rose" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h2 className="font-heading text-xl font-bold">Add Student</h2>
          <form className="mt-4 space-y-3" onSubmit={submitStudent}>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="name"
              value={studentForm.name}
              onChange={onStudentChange}
              placeholder="Student Name"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="email"
              type="email"
              value={studentForm.email}
              onChange={onStudentChange}
              placeholder="Student Email"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="studentId"
              value={studentForm.studentId}
              onChange={onStudentChange}
              placeholder="Student ID"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="password"
              value={studentForm.password}
              onChange={onStudentChange}
              placeholder="Default Password"
              required
            />
            <button type="submit" className="btn-primary w-full" disabled={submittingStudent}>
              {submittingStudent ? "Adding..." : "Add Student"}
            </button>
          </form>
        </div>

        <div className="glass-card p-5">
          <h2 className="font-heading text-xl font-bold">Issue Certificate</h2>
          <form className="mt-4 space-y-3" onSubmit={submitCertificate}>
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              onChange={(event) => applyStudentToCertificateForm(event.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select existing student
              </option>
              {studentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="studentName"
              value={certificateForm.studentName}
              onChange={onCertificateChange}
              placeholder="Student Name"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="studentEmail"
              type="email"
              value={certificateForm.studentEmail}
              onChange={onCertificateChange}
              placeholder="Student Email"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="studentId"
              value={certificateForm.studentId}
              onChange={onCertificateChange}
              placeholder="Student ID"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="courseName"
              value={certificateForm.courseName}
              onChange={onCertificateChange}
              placeholder="Course Name"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="eventName"
              value={certificateForm.eventName}
              onChange={onCertificateChange}
              placeholder="Event Name (Optional)"
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="issuerName"
              value={certificateForm.issuerName}
              onChange={onCertificateChange}
              placeholder="Issuer Name"
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              name="issueDate"
              type="date"
              value={certificateForm.issueDate}
              onChange={onCertificateChange}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-300 px-3 py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:text-white"
              name="certificatePdf"
              type="file"
              accept="application/pdf"
              onChange={onCertificateChange}
              required
            />
            <button type="submit" className="btn-primary w-full" disabled={submittingCertificate}>
              {submittingCertificate ? "Issuing..." : "Issue Certificate"}
            </button>
          </form>
        </div>
      </section>

      <section className="glass-card p-5">
        <h2 className="font-heading text-xl font-bold">Issued Certificates</h2>
        <div className="mt-4">
          <CertificateTable certificates={certificates} onRevoke={revokeCertificate} showActions />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
