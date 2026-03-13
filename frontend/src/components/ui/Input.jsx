import React from 'react';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`block w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-all placeholder-gray-400 bg-white hover:border-gray-200 ${className}`}
      {...props}
    />
  );
};

export default Input;
