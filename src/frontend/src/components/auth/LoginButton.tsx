import React, { useContext } from "react";
import { SessionContext } from "../../context/sessionContext";
import './styles.css'; 

const LoginButton: React.FC = () => {
    const { login } = useContext(SessionContext);

    return (
        <button translate="no" className="button" onClick={login}>Log in</button>
    );
};

export default LoginButton;

