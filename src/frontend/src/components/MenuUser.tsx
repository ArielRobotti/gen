import { useEffect, useRef, useState } from "react";

const MenuUser = ({ name }: { name: string }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div >
      <div 
        className="relative text-black mr-[30px] h-[40px] w-[40px] bg-gray-300 rounded-full flex items-center justify-center cursor-pointer " 
        ref={menuRef}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className="select-none">{name[0]}</span>
      </div>

      <div
        className={`absolute top-[35px] right-0 mt-2 w-40 bg-gray-700 text-white rounded shadow-lg transition-all duration-300 origin-top transform ${showMenu ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
      >
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">My critters</button>
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Option 2</button>
        <button className="block w-full text-left px-4 py-2 hover:bg-gray-500">Option 3</button>
      </div>
    </div>
  );
};

export default MenuUser;
