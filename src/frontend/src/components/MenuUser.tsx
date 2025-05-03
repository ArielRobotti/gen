import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/sessionContext";

const MenuUser = ({ name }: { name: string }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="m-[2px] z-70">
      <div
        className="relative text-black mr-[10px] h-[40px] w-[40px] bg-gray-300 rounded-full flex items-center justify-center cursor-pointer "
        ref={menuRef}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className="select-none">{name[0]}</span>
      </div>

      <div
        className={`absolute top-[-5px] right-[2px] mt-2 w-40 bg-gray-700 text-white rounded shadow-lg transition-all duration-500 origin-top transform ${showMenu ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
      >
        <div onMouseDown={() => navigate("/dashboard")} className="flex items-center justify-between px-4 py-2 hover:bg-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 0 24 24" width="26" focusable="false" aria-hidden="true" ><path fill="currentColor" d="M4 20h14v1H3V6h1v14zM6 3v15h15V3H6zm2.02 14c.36-2.13 1.93-4.1 5.48-4.1s5.12 1.97 5.48 4.1H8.02zM11 8.5a2.5 2.5 0 015 0 2.5 2.5 0 01-5 0zm3.21 3.43A3.507 3.507 0 0017 8.5C17 6.57 15.43 5 13.5 5S10 6.57 10 8.5c0 1.69 1.2 3.1 2.79 3.43-3.48.26-5.4 2.42-5.78 5.07H7V4h13v13h-.01c-.38-2.65-2.31-4.81-5.78-5.07z"></path></svg>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Profile</button>
        </div>
        <hr className=" border-gray-500" />

        <div onMouseDown={() => navigate("/dashboard")}>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">My critters</button>
        </div>
        <div onMouseDown={() => navigate("/")}>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Option 2</button>
        </div>
        <div onMouseDown={() => navigate("/")}>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Option 3</button>
        </div>
        <hr className=" border-gray-500" />

        <div onMouseDown={logout}>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6  text-white"  enable-background="new 0 0 24 24"  viewBox="0 0 24 24" focusable="false" aria-hidden="true" ><path fill="currentColor" d="M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z"></path></svg>
            <button className="block w-full text-left text-white px-4 py-2 hover:bg-gray-500">Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuUser;
