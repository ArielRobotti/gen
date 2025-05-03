import React from 'react';
interface CustomModalProps {
    internetIdentityUrl: string;
    isOpen: boolean;
    onClose: () => void;
    onSelectProvider: (providerUrl: string) => void;
}

const ModalProviderSelect: React.FC<CustomModalProps> = ({ isOpen, internetIdentityUrl, onClose, onSelectProvider }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-providers" onClick={(e) => e.stopPropagation()}>
                <h2 className='mb-8'>Elige un Proveedor de Identidad</h2>
                <button className="button" onClick={() => onSelectProvider(internetIdentityUrl)}>Internet Identity</button>
                <button className="button"  onClick={() => onSelectProvider("https://nfid.one/authenticate/?applicationName=my-ic-app")}>NFID</button>
            </div>
        </div>
    );
};

export default ModalProviderSelect;