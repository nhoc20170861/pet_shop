import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import CartNotification from "../page/CartNotification";
import { useEffect, useState, useContext } from "react";
import Cookies from "js-cookie";
import { CartContext } from "../../App";
function Header({ onDataTransfer }) {
  // get access token from local storage
  const accessToken = localStorage.getItem("accessToken");
  // get cart from session storage
  const [show, setShow] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [cartQuantity, setCartQuantity] = useState(0);
  const { cartItems, setCartItems } = useContext(CartContext);
  useEffect(() => {
    // const storedCartItems = sessionStorage.getItem("cartItems");
    // if (storedCartItems) {
    //   setCartQuantity(JSON.parse(storedCartItems).length);
    // }
    console.log("change cart");
    setCartQuantity(cartItems.length);
  }, [cartItems]);

  const searchProduct = async () => {
    const isSearchPage = location.pathname === "/search";
    if (!isSearchPage) {
      navigate("/search", { state: { textSearch: textSearch } });
    } else {
      onDataTransfer(textSearch);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    Cookies.remove("user");
    navigate("/");
  };

  return (
    <div className=" ">
      <div className="flex justify-center bg-gradient-[80deg] from-[#3D51AC] to-[#232c72] to-15% bg-transparent bg-gradient-to-r ">
        <header className="flex  text-white  justify-between  text-sm w-1220   ">
          <div className="flex justify-between">
            <button>
              <FaPhone />
            </button>
            <div className="flex px-4 items-center">0898520760</div>

            <div className="flex px-4 items-center">
              217 Lâm Văn Bền, P. Bình Thuận, Q.7, HCM
            </div>
          </div>
          <div className="flex justify-between">
            {/* search*/}
            <div className="flex items-center">
              <input
                id="search-input"
                className="w-[300px]  h-[100%] pl-[10px] bg-white border-[1px] border-[#142391] outline-0 rounded-l-[20px] border-r-0 origin-right text-black"
                type="text"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                placeholder="Search..."
              ></input>

              <button
                id="search-btn"
                className="search px-4 hover:bg-blue-600 rounded h-[100%]"
                onClick={searchProduct}
              >
                <FaSearch className="" />
              </button>
            </div>
            {/* gio hang*/}
            <Link
              to={accessToken ? "/cart" : "/login"}
              className="cart flex flex-col items-center justify-center px-4 hover:bg-sky-700 relative h-[100%]"
            >
              <FaCartPlus className="" />
              <span className="cart-notice absolute pt-[1px] pb-[2px] px-[5px] bg-[#23a455] text-white text-[8px] font-normal rounded-[100%] leading-[10px] top-[3px] right-[5px] text-center">
                {cartQuantity}
              </span>
            </Link>
            {/* login*/}

            {accessToken ? (
              <>
                <Link
                  to="/profile"
                  id="login-btn"
                  className="self-center p-2 rounded hover:bg-blue-600"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  id="login-btn"
                  className="self-center p-2 rounded hover:bg-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  id="login-btn"
                  className="self-center p-2 rounded hover:bg-blue-600"
                >
                  Log in
                </Link>
                <Link
                  to="/Signup"
                  id="sign-btn"
                  className="self-center  p-2 rounded hover:bg-blue-600"
                >
                  {" "}
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>
        {show && <CartNotification show={show} setShow={setShow} />}
      </div>

      <div className=" flex justify-center py-5 ">
        <div className="w-1220 ">
          <div className="flex justify-between   ">
            <div>
              <img
                className="w-48"
                src="https://petservicehcm.com/wp-content/uploads/2019/11/Pet_logo.png.webp"
                alt="Pet logo"
              ></img>
            </div>
            {/* page*/}

            <Link
              to="/"
              className="p-1.5 self-center font-bold text-neutral-600 hover:text-blue-600 "
            >
              TRANG CHỦ
            </Link>
            <Link
              to="/About"
              className="p-1.5 self-center font-bold text-neutral-600 hover:text-blue-600 "
            >
              GIỚI THIỆU
            </Link>
            <div className="p-1.5 self-center font-bold text-neutral-600 flex items-center hover:text-blue-600  relative  group  ">
              DỊCH VỤ
              <ul className=" hidden w-264 group-hover:block  z-10 absolute  top-full rounded-lg text-sm text-cyan-900 bg-slate-100 border border-solid border-[#273172] pt-2 ">
                <li className=" left-0  p-3 hover:text-blue-600 ">
                  {" "}
                  <Link to="/">THÚ Y TẠI NHÀ</Link>
                </li>
                <li className=" left-0  p-3 hover:text-blue-600  ">
                  <Link to="/">TẮM - VỆ SINH TẠI NHÀ</Link>
                </li>
                <li className=" left-0  p-3 hover:text-blue-600  ">
                  <Link to="/">CẮT - TỈA LÔNG TẠI NHÀ</Link>
                </li>
                <li className=" left-0  p-3 hover:text-blue-600  ">
                  <Link to="/">COMBO</Link>
                </li>
              </ul>
              <FaChevronDown className="self-center pl-1 font-none inline" />
            </div>
            <Link
              to=""
              className=" p-1.5 self-center font-bold text-neutral-600 hover:text-blue-600  relative group flex items-center"
            >
              CỬA HÀNG
              <ul className=" hidden w-250 group-hover:block  z-10 absolute top-full rounded-lg text-sm text-cyan-900 bg-slate-100 border border-solid border-[#273172] pt-2 ">
                <li className=" left-0  p-3 hover:text-blue-600 ">
                  {" "}
                  <Link to="/FoodProduct">THỰC PHẨM THÚ CƯNG</Link>
                </li>
                <li className=" left-0  p-3 hover:text-blue-600  ">
                  <Link to="/HygieneProduct">SẢN PHẨM VỆ SINH</Link>
                </li>
                <li className=" left-0  p-3 hover:text-blue-600  ">
                  <Link to="/TreatmentProduct">SẢN PHẨM ĐIỀU TRỊ</Link>
                </li>
              </ul>
              <FaChevronDown className="self-center pl-1 font-none inline" />
            </Link>
            <Link
              to="/Contact"
              className="p-1.5 self-center font-bold text-neutral-600 hover:text-blue-600 group relative"
            >
              LIÊN HỆ
            </Link>
            {/* ONLINE BOOKING*/}
            <Link to="/booking" className="flex ">
              <button className="  p-1.5 bg-black self-center text-white rounded-full hover:bg-blue-600 px-4  ">
                ONLINE BOOKING
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
