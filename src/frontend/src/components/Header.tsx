import { useEffect, useState } from 'react';
import { useSession } from '../context/sessionContext';
import MenuUser from './MenuUser';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';
import RegisterButton from './register/RegisterButton';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, identity, backend,  updateUser } = useSession();
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModalRegister(false);
      navigate("/")
      return;
    }
    const timeout = setTimeout(() => {
      if(!user){
        setShowModalRegister(true);
        navigate("/")
      };
    }, 3000);

    return () => clearTimeout(timeout);
  }, [user, isAuthenticated, navigate]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {

    setName(e.target.value);
  };

  const handleRegister = async () => {
    if (name.length < 3 || name.length > 30) { return }
    console.log("host")
    const registerResult = await backend.signUp(name);

    if ("Ok" in registerResult) {
      setShowModalRegister(false);
      updateUser(registerResult.Ok)
      setName("");
    }
    console.log("Register result:", registerResult);
  }

  return (
    <header className="w-full flex justify-between items-center p-1 bg-gradient-to-t from-[#00000000] to-blue-800 pb-4 text-white select-none">
      <button
        className="button"
        onClick={() => navigate("/")}
      >
        HOME
      </button>
      <div className="flex-1"/>
      <h1 className="text-[18px] sm:text-2xl font-bold text-center flex-1">CryptoCritters</h1>
      <div className="flex-2 flex justify-end items-center">
        {!isAuthenticated ? <LoginButton /> : user ? (
          <MenuUser name={user.name} />
        ) : (
          <>
            <RegisterButton onClick={() => setShowModalRegister(!showModalRegister)} />
            <LogoutButton/>
          </>)}
      </div>

      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-1000 
          ${showModalRegister ? 'opacity-95 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setShowModalRegister(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white text-black p-3 rounded-[40px] transform transition-all duration-1000
              ${showModalRegister ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        >
          <h2 className="font-semibold text-lg mb-2 text-center">Register User</h2>
          <p className="text-sm mb-2">Principal ID: {identity.getPrincipal().toString()}</p>
          <input
            type="text"
            required
            maxLength={35}
            placeholder="Name"
            value={name}
            onChange={handleChangeName}
            className="border p-2 w-full mb-2 rounded-full text-center"
          />

          <div className="text-sm flex items-center space-x-2">
            {name.length === 0 ? (
              <span className="text-gray-500">Must be between 3 and 30 characters</span>
            ) : name.length < 3 || name.length > 30 ? (
              <>
                <span className="text-red-600">❌ Must be between 3 and 30 characters</span>
              </>
            ) : (
              <>
                <span className="text-green-600">✅ Nombre válido</span>
              </>
            )}
          </div>
          <div className="flex justify-between px-[30px]">
            <button
              style={{ backgroundColor: "#555555" }}
              className="button"
              onClick={() => setShowModalRegister(false)}
            >
              Close
            </button>
            <button
              className="button"
              onClick={handleRegister}
            >
              Done
            </button>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
