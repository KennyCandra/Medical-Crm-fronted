import React from "react";

interface FormInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string | null;
  id: string;
}

export default function FormInput({
  label,
  type,
  placeholder,
  error,
  id,
  ...rest
}: FormInputProps &
  React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={`border border-gray-200 bg-white rounded-md p-2 focus:outline-none focus:ring-1 w-full`}
          {...rest}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`border border-gray-200 bg-white rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-purple-700 w-full ${
            error && "ring-1 ring-red-500"
          }`}
          {...rest}
        />
      )}
      <span className="text-red-500 text-xs">{error && error}</span>
    </div>
  );
}
