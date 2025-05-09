import React, { useContext } from "react";
import { SessionContext } from "../../context/sessionContext";
import './styles.css'; 

const LoginButton: React.FC = () => {
    const { login } = useContext(SessionContext);

    return (
        <button
            style={{width: "90px", backgroundColor:"#5555aa"}}
            translate="no" 
            className="button" 
            onClick={login}>Connect
        </button>
    );
};

export default LoginButton;

