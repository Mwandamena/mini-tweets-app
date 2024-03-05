import React from "react";

export default function Input({
  disabled,
  label,
  inputRef,
  error,
  type,
  styles,
  onChange,
  small,
  large,
  placeholder,
  name,
  value,
}) {
  return (
    <div className="w-full flex flex-col gap-2 items-start">
      <input
        ref={inputRef}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-md outline-none ${styles} ${
          small && "py-1 px-2 text-xs"
        } ${large && "py-2 px-3"} ${
          error
            ? "border border-rose-500"
            : "border border-veryLightGray dark:border-gray-800"
        }`}
        onChange={(e) => onChange(e)}
        autoComplete="false"
        aria-autocomplete="none"
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}
