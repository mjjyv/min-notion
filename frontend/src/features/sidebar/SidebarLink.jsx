import React from 'react';
import { cn } from '../../utils/cn'; // (Giả định bạn đã có file tiện ích này)

/**
 * Cải tiến SidebarLink
 * @param {boolean} isActive - Trạng thái (được chọn)
 */
const SidebarLink = ({
  icon: Icon,
  label,
  href = '#',
  onClick,
  isActive = false,
}) => {
  // 1. Lớp CSS cho container (xử lý nền)
  const baseClasses = cn(
    'flex items-center w-full px-3 py-2 text-sm rounded-md',
    'transition-colors duration-150 group',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
    // Logic nền (background)
    isActive
      ? 'bg-neutral-700' // Nền khi Active (như "Home" trong ảnh)
      : 'hover:bg-neutral-700' // Nền khi Hover
  );

  // 2. Lớp CSS cho Icon
  const iconClasses = cn(
    'h-4 w-4 mr-3',
    isActive
      ? 'text-white' // Icon khi Active
      : 'text-gray-400 group-hover:text-white' // Icon khi Base/Hover
  );

  // 3. Lớp CSS cho Text (Label)
  const textClasses = cn(
    'truncate',
    isActive
      ? 'text-white font-medium' // Text khi Active
      : 'text-gray-400 group-hover:text-white' // Text khi Base (Xanh lam)
  );

  // Render <button> nếu có 'onClick'
  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses}>
        <Icon className={iconClasses} />
        <span className={textClasses}>{label}</span>
      </button>
    );
  }

  // Render <a> (mặc định)
  return (
    <a href={href} className={baseClasses}>
      <Icon className={iconClasses} />
      <span className={textClasses}>{label}</span>
    </a>
  );
};

export default SidebarLink;