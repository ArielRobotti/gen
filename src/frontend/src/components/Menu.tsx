import { useRef, useState, useEffect } from 'react';
import { BugerMenuIcon, GithubIcon, YouTubeIcon } from "./Icons"
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  const handleClickMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleMenuOption = (path: string) => {
    navigate(path);
    setShowMenu(false);
  };

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
    <>
      <BugerMenuIcon className='ml-2' onClick={handleClickMenu} />
      <div
        className={`z-70 absolute top-[40px] left-[2px] w-60 bg-gray-800/80 backdrop-blur-sm text-white rounded-lg shadow-xl transition-transform duration-300 origin-top transform
          ${showMenu ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
        ref={menuRef}
        onClick={() => setShowMenu(!showMenu)}
      >
        <div onMouseDown={() => handleMenuOption("/")} className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <button className="block w-full text-left px-4 py-1 hover:bg-gray-500">About Crypto Critters</button>
        </div>

        <div onMouseDown={() => handleMenuOption("/tutorials")} className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <button className="block w-full text-left px-4 py-1 hover:bg-gray-500">Tutorials</button>
        </div>

        <div onMouseDown={() => handleMenuOption("/metrics")} className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <button className="block w-full text-left px-4 py-1 hover:bg-gray-500">Statistics</button>
        </div>

        <div onMouseDown={() => handleMenuOption("/")} className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <button className="block w-full text-left px-4 py-1 hover:bg-gray-500">Community</button>
        </div>

        <hr className=" border-gray-500" />

        <div onMouseDown={() => handleMenuOption("/")} className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <button className="block w-full text-left px-4 py-1 hover:bg-gray-500">Roadmap</button>
        </div>

        <div onMouseDown={() => handleMenuOption("/")} className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <button className="block w-full text-left px-4 py-1 hover:bg-gray-500">Whitepaper</button>
        </div>

        <div onMouseDown={() => handleMenuOption("/tokenomic")} className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <button className="block w-full text-left px-4 py-1 hover:bg-gray-500">Tokenomic</button>
        </div>

        <hr className=" border-gray-500" />

        <a href="https://internetcomputer.org/" target="blank" className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <div className="block w-full text-left px-4 py-1 hover:bg-gray-500">Internet Computer</div>
        </a>

        <div className="flex items-center justify-between py-1 hover:bg-gray-500 rounded-lg">
          <a
            href="mailto:info.cryptocritters@gmail.com"
            className="block w-full text-left px-4 py-1 hover:bg-gray-500"
          >
            Contact
          </a>
        </div>


        <a href="https://github.com/ArielRobotti/gen" target="blank" className="flex items-center justify-between py-1  rounded-full">
          <div className="block w-full h-[40px] text-left px-4 py-1 hover:bg-gray-500 rounded-lg"><GithubIcon className=''/></div>
        </a>

        <a href="https://www.youtube.com/@CryptoCritterMultiverse" target="blank" className="flex items-center justify-between py-1 rounded-full">
          <div className="block w-full text-left px-4 py-1 mb-2 hover:bg-gray-500 rounded-lg"><YouTubeIcon className=''/></div>
        </a>

      </div>
    </>
  )
};

export default Menu