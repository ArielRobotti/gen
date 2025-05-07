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
        className="relative text-black mr-[10px] h-[40px] w-[40px] bg-gradient-to-b from-[#446688] to-[#223355]  rounded-full flex items-center justify-center cursor-pointer "
        ref={menuRef}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className="select-none">{name.split(" ").slice(0, 2).map(n => n[0]).join(" ")}</span>
      </div>

      <div
        className={`absolute top-[5px] right-[2px] w-48 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg shadow-xl transition-transform duration-300 origin-top transform
          ${showMenu ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
      >
        <div onMouseDown={() => navigate("/dashboard")} className="flex items-center justify-between py-1 hover:bg-gray-500">
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Profile {name.split(" ")[0]}</button>
        </div>
        <hr className=" border-gray-500" />

        <div onMouseDown={() => navigate("/dashboard")}>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">My critters</button>
        </div>
        <div onMouseDown={() => navigate("/space")}>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Space</button>
        </div>
        <div onMouseDown={() => navigate("/")}>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-500"></button>
        </div>
        <hr className=" border-gray-500" />

        <div onMouseDown={logout}>
          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6  text-white"  enableBackground="new 0 0 24 24"  viewBox="0 0 24 24" focusable="false" aria-hidden="true" ><path fill="currentColor" d="M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z"></path></svg>
            <button className="block w-full text-left text-white px-4 py-2 hover:bg-gray-500">Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuUser;
