import React, { useState, useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import AuthorizeUser from "./AuthorizeUser";
import AuthorizeUserMobile from "./AuthorizeUserMobile";
import NavBrand from "./NavBrand";
import useAuth from "../../hooks/useAuth";

const menu = [
  { id: 1, text: "Home", to: "/" },
  { id: 2, text: "Products", to: "/products" },
  { id: 3, text: "Contact", to: "/contact" },
  { id: 4, text: "Orders", to: "/userOrders" },
];

const Navbar = () => {
  const [changeHeader, setChangeHeader] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true); // Track authorization status

  const allowedEmails = [
    "b22es006@iitj.ac.in",
    "b22cs101@iitj.ac.in",
    "b22cs014@iitj.ac.in",
  ];

  // Simulating authentication hook or user context
  const { user: currentUser, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !currentUser) return;
    setIsAdmin(allowedEmails.includes(currentUser.email));
    setIsAuthorized(allowedEmails.includes(currentUser.email));
  }, [currentUser, isLoading]);

  const handleClick = () => {
    setMobileNav(!mobileNav);
  };

  const onChangeHeader = () => {
    setChangeHeader(window.scrollY >= 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", onChangeHeader);
    return () => {
      window.removeEventListener("scroll", onChangeHeader);
    };
  }, []);

  const showUnauthorizedDialog = () => {
    alert("You are not authorized to access this section.");
    console.log("Now, the current user is :- ", currentUser);
  };

  return (
    <header
      className={
        changeHeader
          ? "bg-white fixed z-50 top-0 left-0 w-full shadow-md transition duration-500"
          : "bg-transparent fixed z-50 top-0 left-0 w-full transition duration-500"
      }
      style={{ backgroundColor: "#98F5F9" }}
    >
      {/* Desktop nav */}
      <nav className="flex items-center max-w-screen-xl mx-auto px-6 py-3">
        <div className="flex flex-grow">
          <NavBrand />
        </div>

        {/* Menu links for desktop */}
        <div className="hidden md:flex lg:flex space-x-8">
          <ul className="flex items-center space-x-4">
            {menu.map((item) => (
              <li key={item.id}>
                <NavLink
                  exact="true"
                  to={item.to}
                  className="text-gray-600 text-lg poppins"
                  activeClassName="border-b-4 border-blue-600 text-blue-700"
                >
                  {item.text}
                </NavLink>
              </li>
            ))}
            {isAdmin ? (
              <li key="admin">
                <NavLink
                  exact="true"
                  to="/admin"
                  className="text-gray-600 text-lg poppins"
                  activeClassName="border-b-4 border-blue-600 text-blue-700"
                >
                  Admin
                </NavLink>
              </li>
            ) : (
              <li key="admin">
                <button
                  onClick={showUnauthorizedDialog}
                  className="text-gray-600 text-lg poppins"
                >
                  Admin
                </button>
              </li>
            )}
          </ul>
          <AuthorizeUser />
        </div>

        {/* Menu icon for mobile */}
        <div className="block md:hidden lg:hidden">
          <HiMenuAlt3
            className="w-10 h-10 ring-blue-300 text-gray-700 border border-gray-400 focus:ring-4 cursor-pointer rounded-lg p-2 transform transition duration-200 hover:scale-110"
            onClick={handleClick}
          />
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileNav && (
        <nav className="bg-white shadow-lg mx-6 mt-2 p-4 rounded-lg border border-gray-300 py-4 block md:hidden lg:hidden">
          <ul className="mb-2">
            {menu.map((item) => (
              <li key={item.id} className="mb-3">
                <NavLink
                  exact="true"
                  to={item.to}
                  className="text-gray-600 poppins text-lg text-center py-2 px-3 w-full hover:bg-gray-200 transition duration-300 cursor-default block rounded-lg"
                  activeClassName="border-l-4 border-blue-700 bg-gray-200"
                >
                  {item.text}
                </NavLink>
              </li>
            ))}
            {isAdmin ? (
              <li key="admin" className="mb-3">
                <NavLink
                  exact="true"
                  to="/admin"
                  className="text-gray-600 poppins text-lg text-center py-2 px-3 w-full hover:bg-gray-200 transition duration-300 cursor-default block rounded-lg"
                  activeClassName="border-l-4 border-blue-700 bg-gray-200"
                >
                  Admin
                </NavLink>
              </li>
            ) : (
              <li key="admin" className="mb-3">
                <button
                  onClick={showUnauthorizedDialog}
                  className="text-gray-600 poppins text-lg text-center py-2 px-3 w-full hover:bg-gray-200 transition duration-300 cursor-default block rounded-lg"
                >
                  Admin
                </button>
              </li>
            )}
          </ul>
          <AuthorizeUserMobile />
        </nav>
      )}
    </header>
  );
};

export default Navbar;
