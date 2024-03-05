import { CgSpinner } from "react-icons/cg";

export default function Button({
  label,
  onClick,
  outline,
  large,
  small,
  disabled,
  styles,
  icon,
  loading,
  type,
}) {
  return (
    <button
      type={type}
      className={`${styles} w-full rounded-3xl inline-flex justify-center gap-2 items-center font-bold transition-all duration-100 ${
        disabled && "disabled:opacity-80 disabled:cursor-not-allowed"
      } ${small && "py-1 text-xs"} ${large && "py-2 text-sm"} ${
        outline
          ? "bg-white text-secondary border border-veryLightGray dark:border-gray-800"
          : "text-white"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {loading && <CgSpinner size={18} className="animate-spin" />}
      {icon && icon}
      {label && <h5>{loading ? "Processing..." : label}</h5>}
    </button>
  );
}
