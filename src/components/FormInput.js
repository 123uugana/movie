export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold text-[#111214]">
        {label} <span className="text-red-500">*</span>
      </span>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder="Placeholder"
        className="h-8 w-full rounded border border-slate-300 bg-white px-3 text-xs text-black outline-none placeholder:text-slate-400 focus:border-sky-400"
      />
    </label>
  );
}
