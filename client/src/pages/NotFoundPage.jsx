import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-4 py-8">
      <section className="glass-card w-full p-8 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-slate-900">404</h1>
        <p className="mt-3 text-slate-600">Page not found.</p>
        <Link className="btn-primary mt-5 inline-block" to="/">
          Back to Home
        </Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
