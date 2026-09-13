export function TextField({
  label,
  name,
  optional,
  defaultValue,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  optional?: boolean;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label}{" "}
        {optional && <span className="text-slate-400">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#8B6F47] focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/15"
      />
    </div>
  );
}
