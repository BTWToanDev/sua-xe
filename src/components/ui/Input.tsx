import clsx from 'clsx';
import React from 'react';

// Định nghĩa kiểu cho props của Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({ className, type = 'text', ...props }) => {
  return (
    <input
      className={clsx(
        'px-4 py-2 border-solid border-2 w-full border-gray-600 rounded-lg focus:outline-none disabled:bg-slate-200 disabled:border-green-300',
        className
      )}
      type={type}
      {...props}
    />
  );
};

export default Input;
