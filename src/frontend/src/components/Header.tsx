import { useEffect, useState } from 'react';
import { useSession } from '../context/sessionContext';
import Menu from './Menu';
import MenuUser from './MenuUser';
import LoginButton from './auth/LoginButton';
import LogoutButton from './auth/LogoutButton';
import RegisterButton from './register/RegisterButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, BellIcon, MetricsIcon, MessageIcon } from "./Icons";

const Header = () => {
  const { user, notifications, isAuthenticated, identity, backend, updateUser, updateNotifications } = useSession();
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModalRegister(false);
      if (location.pathname === "/dashboard") {
        navigate("/")
      }
      return;
    }
    const timeout = setTimeout(() => {
      if (!user) {
        setShowModalRegister(true);
        navigate("/")
      };
    }, 3000);

    return () => clearTimeout(timeout);
  }, [user, isAuthenticated, navigate, location.pathname]);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {

    setName(e.target.value);
  };

  const handleRegister = async () => {
    if (name.length < 3 || name.length > 30) { return }
    console.log("host")
    const registerResult = await backend.signUp(name);

    if ("Ok" in registerResult) {
      setShowModalRegister(false);
      updateUser(registerResult.Ok.user)
      updateNotifications(registerResult.Ok.notifications)
      setName("");
    }
    console.log("Register result:", registerResult);
  }

  return (
    <>
      <header className="w-full flex justify-between items-center p-1 bg-gradient-to-t from-[#00000000] to-blue-800 pb-4 text-white select-none h-[60px]">
        <div className='flex items-center'>
          <Menu />
          <MetricsIcon onClick={() => navigate("./metrics")} className='ml-2' />
        </div>


        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1
            onClick={() => navigate("./")}
            className="hidden sm:block text-[18px] sm:text-2xl font-bold cursor-pointer"
          >
            Crypto Critters
          </h1>
          <HomeIcon
            onClick={() => navigate("./")}
            className="block sm:hidden text-2xl cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-end w-[200px]">
          
          {!isAuthenticated ? (
            <LoginButton />
          ) : user ? (
            <>
              <div className='flex items-center'>
                <MessageIcon qty={0}/>
                <BellIcon onClick={() => {}} qty={notifications.length } className='mr-4' />
              </div>
              <MenuUser />
            </>
          ) : (
            <>

              <RegisterButton
                onClick={() => setShowModalRegister(!showModalRegister)}
                className='absolute top-[60px] left-1/2 transform -translate-x-1/2 mt-2 z-10'
              />
              <LogoutButton />
            </>
          )}
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
                className="button w-[110px]"
                onClick={() => setShowModalRegister(false)}
              >
                Close
              </button>
              <button
                className="button w-[110px]"
                onClick={handleRegister}
              >
                Done
              </button>
            </div>
          </div>
        </div>

      </header>
    </>
  );
};

export default Header;
