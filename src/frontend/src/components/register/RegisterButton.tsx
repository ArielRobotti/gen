import React from 'react';

type Props = {
  className?: string;
  onClick: () => void;
};

const RegisterButton: React.FC<Props> = ({ className = "", onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`button ${className} w-[150px]`}
    >
      Register
    </button>
  );
};

export default RegisterButton;
