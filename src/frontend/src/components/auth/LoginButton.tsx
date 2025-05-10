import React, { useContext } from "react";
import { SessionContext } from "../../context/sessionContext";
import './styles.css'; 

type Props = {
    className?: string
}
const LoginButton: React.FC<Props> = ({className = ""}) => {
    const { login } = useContext(SessionContext);

    return (
        <div
            translate="no" 
            className={`button ${className} w-[100px]`} 
            onClick={login}>Login
        </div>
    );
};

export default LoginButton;

