import React from 'react';

// Cập nhật: Chấp nhận 'onClick'
const SidebarLink = ({ icon: Icon, label, href = '#', onClick }) => {
  // Nếu có onClick, render <button>
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-md 
                   hover:bg-neutral-700 hover:text-white 
                   transition-colors duration-150 group"
      >
        <Icon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-white" />
        <span className="truncate">{label}</span>
      </button>
    );
  }

  // Mặc định render <a>
  return (
    <a
      href={href}
      className="flex items-center px-3 py-2 text-sm text-gray-300 rounded-md 
                 hover:bg-neutral-700 hover:text-white 
                 transition-colors duration-150 group"
    >
      <Icon className="h-4 w-4 mr-3 text-gray-400 group-hover:text-white" />
      <span className="truncate">{label}</span>
    </a>
  );
};

export default SidebarLink;