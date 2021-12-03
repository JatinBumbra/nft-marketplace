export default function Input({
  label,
  name,
  type,
  value,
  onChange,
  min,
  placeholder,
  required,
}) {
  return (
    <div className='my-4'>
      <label htmlFor={name} className='block mb-1 ml-1'>
        {label}
        {required ? '*' : ''}
      </label>
      <input
        name={name}
        type={type || 'text'}
        className={`border w-full focus:bg-gray-100 outline-none px-4 py-2 rounded-full border-gray-400`}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        min={min}
      />
    </div>
  );
}
