import React, { useContext, useEffect, useState } from "react";
import productAPI from "../api/productAPI";
import { ShowToastMessage } from "../../utils/ShowToastMessage";
import { CartContext } from "../../App";
// sản phẩm điều trị
function Treatment() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const productList = await productAPI.getProductByCategory(
          "Sản phẩm điều trị"
        );
        console.log(productList);
        setProducts(productList.products);
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
  }, []);
  // const [cartItems, setCartItems] = useState([]);

  // useEffect(() => {
  //   const storedCartItems = sessionStorage.getItem("cartItems");
  //   if (storedCartItems) {
  //     setCartItems(JSON.parse(storedCartItems));
  //   }
  // }, []);
  const { cartItems, setCartItems } = useContext(CartContext);
  const addToCartAndStore = (product) => {
    const existingCartItem = cartItems.find((item) => item._id === product._id);

    if (existingCartItem) {
      const updatedCartItems = cartItems.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCartItems);
      sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    } else {
      const newCartItem = { ...product, quantity: 1 };
      const updatedCartItems = [...cartItems, newCartItem];
      setCartItems(updatedCartItems);
      sessionStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
    // alert("Thêm vào giỏ hàng thành công");
    ShowToastMessage({
      title: "AddProductToCart",
      message: "Thêm vào giỏ hàng thành công",
      type: "success",
    });
  };
  return (
    <div className="flex justify-center mt-8">
      <div className="flex flex-wrap w-1220 justify-between ">
        {/* Danh mục sản phẩm */}
        <div className="w-1/6">
          <h2 className="font-bold"> DANH MỤC SẢN PHẨM</h2>
        </div>
        {/* Sản phẩm */}
        <div className="flex w-5/6 flex-wrap gap-1 justify-between items-center">
          {Array.isArray(products) ? (
            products.map((product, index) => (
              <div
                key={index}
                className="w-1/4 border-none rounded-lg py-2 shadow-xl hover:shadow-2xl bg-white mb-4 "
              >
                <img
                  className="h-[15.125rem] pb-2 px-6"
                  src={product.image}
                  alt="PET SHOP"
                />
                <h4 className="text-center pb-1 opacity-60">
                  Thực phẩm thú cưng
                </h4>
                <p className="text-center pb-1 font-bold">
                  {product.productName}
                </p>
                <p className="text-center">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => addToCartAndStore(product)}
                    className="bg-[#273172] text-white w-[80%] py-2 rounded-lg hover:bg-[#e80000]"
                  >
                    Mua hàng
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Treatment;
