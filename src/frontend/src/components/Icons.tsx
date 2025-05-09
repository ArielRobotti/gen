import React from "react";
// import { useNavigate } from "react-router-dom";

type IconProps = {
  className?: string;
  onClick?: () => void;
};

export const HomeIcon: React.FC<IconProps> = ({ className = "", onClick }) => {
  //   const navigate = useNavigate();
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-8 h-8 text-gray-700 cursor-pointer ${className}`}
      fill="#dedede"
      aria-hidden="true"
    >
      <path d="M12 3L3 10v1h2v8h5v-6h4v6h5v-8h2v-1L12 3z" />
    </svg>
  );
};

export const BellIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-6 h-6 text-gray-700 ml-4 cursor-pointer ${className}`}
    fill="#dedede"
    aria-hidden="true"
  >
    <path d="M12 2C10.343 2 9 3.343 9 5v1.068C6.165 7.2 4.5 9.828 4.5 13v3l-1.5 1.5v1h18v-1L19.5 16v-3c0-3.172-1.665-5.8-4.5-6.932V5c0-1.657-1.343-3-3-3zm0 20c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2z" />
  </svg>
);

export const MetricsIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    // strokeLinecap="round"
    // strokeLinejoin="round"
    className={`w-8 h-8 cursor-pointer ${className}`}
  >
  {/* <path d="M3 5v16h18" /> */}
  <path d="M3 18v-5h3v5H7z" />
  <path d="M7 18v-11h3v11h-3z" />
  <path d="M11 18v-8h3v8h-3z" />  
  <path d="M15 18v-15h3v15h-3z" />
  {/* <path d="M15 20V8h3v8h-3z" />   */}
</svg>
);


