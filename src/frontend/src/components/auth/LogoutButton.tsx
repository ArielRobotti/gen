import React, { useContext } from "react";
import { SessionContext } from "../../context/sessionContext";
import './styles.css'; 

const LogoutButton: React.FC = () => {
    const { logout } = useContext(SessionContext);

    return (
        <button className="button" onClick={logout}>Log out</button>
    );
};

export default LogoutButton;
