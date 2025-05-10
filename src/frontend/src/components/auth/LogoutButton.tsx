import React, { useContext } from "react";
import { SessionContext } from "../../context/sessionContext";
import './styles.css'; 

const LogoutButton: React.FC = () => {
    const { logout } = useContext(SessionContext);

    return (
        <button 
            className="button w-[100px]"
            onClick={logout}>Logout
        </button>
    );
};

export default LogoutButton;
