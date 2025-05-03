import React from 'react';

type Props = {
  onClick: () => void;
};

const RegisterButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="button"
    >
      Register
    </button>
  );
};

export default RegisterButton;
