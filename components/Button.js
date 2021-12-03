export default function Button({ children, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 active:bg-blue-800 w-full rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        className || ''
      }`}
    >
      {children}
    </button>
  );
}
