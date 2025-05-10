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

export const MessageIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
  <svg
    onClick={onClick}
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
);

export const GithubIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 cursor-pointer fill-[#dedede] ${className}`}
    viewBox="0 0 24 24"
    width="32"
    height="32"
    aria-hidden="true"
    role="img"
  >
    <path d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z" />
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ className = "", onClick }) => (
  <svg  
  viewBox="0 0 24 24"
    onClick={onClick}
    className={`h-5 w-5 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);

export const IntIdIcon: React.FC<IconProps> = ({className = "", onClick}) => (

  <svg xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 147 28"
    className={`w-8 h-8 cursor-pointer fill-[#dedede] ${className}`}
    onClick={onClick}
  >
    <g fill="currentColor">
      <title>Internet Identity</title>
      <path d="M65.561 1.08v11.632h3.134V1.08H65.56Zm8.761 4.725 4.037 6.907h3.15V1.08h-3.051v6.316L74.832 1.08h-3.544v11.632h3.035V5.805ZM89.58 3.984v8.728h-3.084V3.984H83.15V1.08h9.795v2.904H89.58Zm5.004-2.904v11.632h7.482v-2.707h-4.43v-1.87h4.004v-2.56h-4.003V3.738h4.396V1.08h-7.449Zm9.664 11.632V1.08h4.905c2.362 0 3.904 1.575 3.904 3.74 0 1.576-.87 2.741-2.149 3.25l2.199 4.642h-3.331l-1.837-4.216h-.64v4.216h-3.051Zm4.331-6.579c.92 0 1.395-.525 1.395-1.263 0-.738-.475-1.246-1.395-1.246H107.3v2.51h1.279Zm9.516-.328 4.036 6.907h3.149V1.08h-3.051v6.316l-3.625-6.316h-3.545v11.632h3.036V5.805Zm9.779 6.907V1.08h7.448v2.658h-4.396v1.837h4.003v2.56h-4.003v1.87h4.429v2.707h-7.481Zm15.656 0V3.984h3.364V1.08h-9.795v2.904h3.347v8.728h3.084Z"></path>
      <path d="M65.524 27.49h3.145V15.812h-3.145V27.49Zm8.822-3.014h1.12c1.466 0 2.734-.857 2.734-2.833 0-1.977-1.268-2.866-2.734-2.866h-1.12v5.699Zm1.136 3.014h-4.216V15.812h4.233c3.393 0 5.863 2.224 5.863 5.847 0 3.624-2.47 5.83-5.88 5.83Zm7.863 0h7.51v-2.718H86.41v-1.878h4.019v-2.569h-4.02V18.48h4.415v-2.668h-7.478V27.49Zm19.96 0h-3.162l-4.052-6.934v6.934h-3.047V15.812h3.558l3.64 6.341v-6.34h3.063V27.49Zm8.108-8.763h3.376v-2.915h-9.832v2.915h3.36v8.763h3.096v-8.763Zm8.164 8.763h-3.146V15.812h3.146V27.49Zm8.098-8.763h3.376v-2.915h-9.833v2.915h3.36v8.763h3.097v-8.763Zm3.865-2.915 3.837 6.901v4.777h3.13v-4.777l3.87-6.9h-3.425l-1.927 3.952-1.928-3.953h-3.557Z"></path>
    </g>
    <g fill="#00ACE5">
      <path d="M48.691 23.265c-4.047 0-8.322-2.646-10.42-4.567-2.293-2.1-8.596-8.936-8.624-8.967C25.514 5.118 19.957 0 14.412 0 7.734 0 1.91 4.624.395 10.751c.117-.403 2.238-6.016 10.208-6.016 4.048 0 8.322 2.646 10.42 4.567 2.293 2.1 8.596 8.936 8.624 8.967 4.133 4.612 9.69 9.73 15.235 9.73 6.678 0 12.502-4.624 14.017-10.751-.117.403-2.238 6.016-10.208 6.016Z"></path>
      <path fill="url(#logo-loop-bottom)" d="M29.647 18.27c-.014-.017-1.83-1.985-3.864-4.132-1.1 1.305-2.685 3.084-4.507 4.68-3.395 2.977-5.602 3.6-6.864 3.6-4.762 0-8.646-3.776-8.646-8.418 0-4.642 3.88-8.39 8.646-8.419.173 0 .382.018.636.063-1.432-.55-2.953-.909-4.445-.909-7.967 0-10.09 5.61-10.207 6.015A13.507 13.507 0 0 0 .001 14c0 7.72 6.368 14 14.309 14 3.31 0 7.018-1.697 10.838-5.044 1.805-1.582 3.37-3.275 4.546-4.636a2.261 2.261 0 0 1-.045-.05l-.002.001Z"></path>
      <path fill="url(#logo-loop-top)" d="M29.647 9.73c.015.016 1.83 1.985 3.864 4.132 1.1-1.305 2.685-3.084 4.507-4.68 3.395-2.977 5.602-3.6 6.864-3.6 4.762 0 8.646 3.776 8.646 8.418 0 4.616-3.88 8.39-8.646 8.419a3.67 3.67 0 0 1-.636-.063c1.432.55 2.954.909 4.445.909 7.967 0 10.09-5.61 10.207-6.015.258-1.044.395-2.132.395-3.249C59.294 6.281 52.823 0 44.883 0c-3.311 0-6.916 1.698-10.735 5.044C32.342 6.626 30.776 8.32 29.6 9.68l.045.05h.001Z"></path>
    </g>
    <defs>
      <linearGradient id="logo-loop-bottom" x1="21.883" x2="2.381" y1="26.169" y2="5.974" gradientUnits="userSpaceOnUse">
        <stop offset=".22" stop-color="#FF0079"></stop>
        <stop offset=".89" stop-color="#592489"></stop>
      </linearGradient>
      <linearGradient id="logo-loop-top" x1="37.398" x2="56.9" y1="1.844" y2="22.039" gradientUnits="userSpaceOnUse">
        <stop offset=".21" stop-color="#FF4B00"></stop>
        <stop offset=".68" stop-color="#FFAB00"></stop>
      </linearGradient>
    </defs>
  </svg>

)
