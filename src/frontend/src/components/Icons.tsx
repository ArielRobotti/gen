import React from "react";

type IconProps = {
  className?: string;
  onClick?: () => void;
};
export const BugerMenuIcon: React.FC<IconProps> = ({ className = "", onClick }) => {

  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-8 h-9 text-gray-700 cursor-pointer fill-[#dedede] ${className}`}
      aria-hidden="true"
    >
      <rect x="4" y="6" width="16" height="2" rx="1.5" />
      <rect x="4" y="11" width="16" height="2" rx="1.5" />
      <rect x="4" y="16" width="16" height="2" rx="1.5" />
    </svg>
  );
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

export const BellIcon: React.FC<IconProps & { qty: number }> = ({ className = "", qty = 0, onClick }) => (
  <div className={`relative w-9 h-8 ml-4 ${className}`} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 28"
      className="w-9 h-9 text-gray-700 cursor-pointer"
      fill="#dedede"
      aria-hidden="true"
    >
      <path d="M12 2C10.343 2 9 3.343 9 5v1.068C6.165 7.2 4.5 9.828 4.5 13v3l-1.5 1.5v1h18v-1L19.5 16v-3c0-3.172-1.665-5.8-4.5-6.932V5c0-1.657-1.343-3-3-3zm0 20c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2z" />
    </svg>

    {qty > 0 && (
      <div className="absolute top-6 left-5 bg-red-600 text-white text-xs font-bold min-w-4 h-4 p-[2px] flex items-center justify-center rounded-full">
        {qty}
      </div>
    )}
  </div>
);

export const MessageIcon: React.FC<IconProps & { qty: number }> = ({ className = "", onClick, qty }) => (
  <div className={`relative w-9 h-8 ml-4 ${className}`} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-8 h-8 cursor-pointer fill-[#dedede] ${className}`}
      viewBox="0 0 24 24"
    >
      <g data-name="Layer 2">
        <g data-name="message-circle">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="16" cy="12" r="1"></circle>
          <circle cx="8" cy="12" r="1"></circle>
          <path d="M19.07 4.93a10 10 0 0 0-16.28 11 1.06 1.06 0 0 1 .09.64L2 20.8a1 1 0 0 0 .27.91A1 1 0 0 0 3 22h.2l4.28-.86a1.26 1.26 0 0 1 .64.09 10 10 0 0 0 11-16.28zm.83 8.36a8 8 0 0 1-11 6.08 3.26 3.26 0 0 0-1.25-.26 3.43 3.43 0 0 0-.56.05l-2.82.57.57-2.82a3.09 3.09 0 0 0-.21-1.81 8 8 0 0 1 6.08-11 8 8 0 0 1 9.19 9.19z"></path>
          <rect width="24" height="24" opacity="0"></rect>
        </g>
      </g>
    </svg>
    {qty > 0 && (
      <div className="absolute top-6 left-3 bg-red-600 text-white text-xs font-bold p-[2px] min-w-4 h-4 flex items-center justify-center rounded-full">
        {qty}
      </div>
    )}
  </div>
);

export const MetricsIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-8 h-8 cursor-pointer ${className}`}
  >
    <path d="M3 18v-5h3v5H7z" />
    <path d="M7 18v-11h3v11h-3z" />
    <path d="M11 18v-8h3v8h-3z" />
    <path d="M15 18v-15h3v15h-3z" />
  </svg>
);


