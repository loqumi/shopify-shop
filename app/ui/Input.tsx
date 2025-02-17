import type {InputHTMLAttributes} from 'react';

type Props = {
  placeholder: string;
  name: string;
  type: string;
  defaultValue: string;
  required?: boolean;
  minLength?: number;
  className?: string;
};

export default function Input(props: Props) {
  const {
    placeholder,
    name,
    defaultValue,
    minLength,
    type,
    required,
    className,
  } = props;

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <input
          required={required}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-label={placeholder}
          defaultValue={defaultValue}
          minLength={minLength ?? 2}
          className={`${className} w-full bg-transparent !rounded-none !border-0 !border-b-2 !border-white/50 font-noto text-gray-800 text-lg focus:outline-none focus:border-white/80 transition-colors peer z-100`}
        />
      </div>
    </div>
  );
}
