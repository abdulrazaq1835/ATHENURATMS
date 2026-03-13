import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white transition-all duration-300 shadow-xl shadow-blue-100 bg-blue-600 hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
