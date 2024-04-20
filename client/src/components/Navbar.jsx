import { useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMenuSharp } from "react-icons/io5";

import { UserContext } from "../context/userContext";

const navLinks = [
  { path: "/", display: "Home" },
  { path: "/create-recipe", display: "Create recipe" },
  { path: "/contact", display: "Contact" },
];

const Navbar = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);

  const { isLoggedIn, avatar } = useContext(UserContext);

  const token = isLoggedIn;

  const toggleMenu = () => {
    menuRef.current.classList.toggle("show-menu");
  };

  const handleStickyHeader = () => {
    const handleScroll = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky-header");
      } else {
        headerRef.current.classList.remove("sticky-header");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  };

  useEffect(() => {
    handleStickyHeader();
  }, []);

  return (
    <header
      className="header flex items-center px-4 md:px-[5rem]"
      ref={headerRef}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <NavLink to={"/"}>
            <h2 className="text-[22px] font-bold">Foodior</h2>
          </NavLink>

          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2rem]">
              {navLinks.map((link, index) => {
                if (link.path === "/create-recipe" && !token) {
                  return null;
                }
                return (
                  <li key={index}>
                    <NavLink
                      to={link.path}
                      className={(navClass) =>
                        navClass.isActive
                          ? " text-sky-500 text-[16px] leading-7 font-[600]"
                          : " text-black text-[16px] leading-7 font-[500] hover:text-sky-500"
                      }
                    >
                      {link.display}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {token && avatar && (
              <div>
                <Link to={"/user/profile/me"}>
                  <figure className="w-[30px] h-[30px] rounded-full cursor-pointer">
                    <img
                      src={avatar}
                      alt="profile"
                      className="w-full rounded-full h-full object-cover"
                    />
                  </figure>
                </Link>
              </div>
            )}

            {token && avatar ? (
              <Link to={"/auth/logout"}>
                <button className=" bg-sky-500 py-[5px] md:py-2 px-3 md:px-6 text-white text-[14px] md:text-[18px] font-[600] h-[44px] flex items-center justify-center rounded-[10px] md:rounded-[50px]">
                  Logout
                </button>
              </Link>
            ) : (
              <Link to={"/auth/sign-in"}>
                <button className=" bg-sky-500 py-[5px] md:py-2 px-3 md:px-6 text-white text-[14px] md:text-[18px] font-[600] h-[44px] flex items-center justify-center rounded-[10px] md:rounded-[50px]">
                  Sign in
                </button>
              </Link>
            )}

            <span onClick={toggleMenu} className="md:hidden">
              <IoMenuSharp className="h-6 w-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
