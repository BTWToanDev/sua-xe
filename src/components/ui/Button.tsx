import clsx from 'clsx';
import React from 'react';

// Định nghĩa kiểu cho props của Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, primary, type = 'button', ...props }) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 focus:outline-none rounded-lg',
        {
          'bg-white text-green-600 hover:bg-blue-100 disabled:bg-slate-300': !primary,
          'bg-green-600 text-white hover:bg-green-500 disabled:bg-green-300': primary,
        },
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
