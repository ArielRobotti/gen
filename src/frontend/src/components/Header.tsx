// import React from 'react';
import { useEffect, useState } from 'react';
import { useSession } from '../context/sessionContext';
import MenuUser from './MenuUser';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';



const Header = () => {
  const { user, isAuthenticated, identity, backend, updateUser } = useSession();
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setShowModalRegister(isAuthenticated && !user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRegister = async () => {
    const registerResult = await backend.signUp(name);
    if ("Ok" in registerResult) {
      setShowModalRegister(false);
      updateUser(registerResult.Ok)
      setName("");
    }
    console.log("Register result:", registerResult);
  }


  return (
    <header className="w-full flex justify-between items-center p-1 bg-gray-900 text-white shadow-md">
      <div className="flex-1" />
      <h1 className="text-2xl font-bold text-center flex-1">CryptoCritters</h1>
      <div className="flex-1 flex justify-end items-center">
        {isAuthenticated && user && (<MenuUser name={user.name}/>)}
        {!isAuthenticated ? <LoginButton /> : <LogoutButton />}
      </div>


      {showModalRegister && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 shadow-lg rounded">
          <h2 className="font-semibold text-lg">Registrar usuario</h2>
          <p>Principal Id: {identity.getPrincipal().toString()}</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleChangeName}
            className="border p-2 mt-2 w-full"
          />
          <div className="flex justify-between mt-4">
            <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleRegister}>
              Register
            </button>
            <button className="bg-gray-300 px-4 py-1 rounded" onClick={() => setShowModalRegister(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
