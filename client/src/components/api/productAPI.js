import axiosClient from "./axiosClient";

const productAPI = {
  getProductByCategory(category) {
    console.log(category);
    const url = `/products/category/${category}`;
    return axiosClient.post(url);
  },

  getAll() {
    const url = `/products/list`;
    return axiosClient.post(url);
  },
  get(id) {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },
  add(data, navigate) {
    const url = `/products/create`;
    axiosClient
      .post(url, data)
      .then((res) => {
        console.log(res);
        navigate("/admin");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  update(id, data, navigate) {
    const url = `/products/update/${id}`;
    axiosClient
      .patch(url, data)
      .then((res) => {
        console.log(res);
        navigate("/admin");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  remove(id) {
    const url = `/products/delete/${id}`;
    axiosClient
      .delete(url)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  filterProduct(name) {
    const url = `/products/find`;
    return axiosClient.post(url, name);
  },
  async createPayment({ amount, cartItems }) {
    const url = "/create_payment_url";
    return axiosClient.post(url, {
      amount,
      cartItems,
      bankCode: "",
      language: "vn",
    });
  },
  async handleTransaction(queryParam) {
    const url = "/vnpay_return?" + queryParam;
    return axiosClient.post(url);
  },
  async handleGetPurchase() {
    const url = "/get_purchase";
    return axiosClient.get(url);
  },
};

export default productAPI;
