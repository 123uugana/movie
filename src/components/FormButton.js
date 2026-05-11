export default function FormButton({
  children,
  type = "button",
  onClick,
  variant = "dark",
  disabled = false,
  className = "",
}) {
  const buttonStyle =
    variant === "light"
      ? "border border-slate-300 bg-white text-[#111214] hover:bg-slate-50"
      : "bg-[#111214] text-white hover:bg-black";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-8 rounded px-4 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-black ${buttonStyle} ${className}`}
    >
      {children}
    </button>
  );
}
