export default function Alert({ type = "info", title, message }) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : "border-slate-200 bg-white text-slate-900";

  return (
    <div className={`card border px-4 py-3 ${styles}`}>
      {title ? <div className="text-sm font-semibold">{title}</div> : null}
      {message ? <div className="mt-1 text-sm opacity-90">{message}</div> : null}
    </div>
  );
}

