import axiosClient from "./axiosClient";
import Cookies from "js-cookie";
const userAPI = {
  login(data, navigate) {
    const url = `/users/login`;
    axiosClient
      .post(url, data)
      .then((res) => {
        const data = res;

        localStorage.setItem("accessToken", res.accessToken);

        if (data.isAdmin === true) {
          navigate("/admin");
        } else {
          delete data["accessToken"];
          Cookies.set("user", JSON.stringify(data));
          console.log(data);
          navigate("/");
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            alert("Username or password is wrong");
          }
        } else {
          console.log("Network error:", err);
        }
      });
  },
  register(data, navigate) {
    const url = `/users/signup`;
    axiosClient
      .post(url, data)
      .then((res) => {
        console.log(res);
        alert("Register successfully");
        navigate("/login");
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 409) {
            alert("Username already exists");
          }
          if (err.response.status === 400) {
            alert("Password not match");
          }
          if (err.response.status === 401) {
            alert("Please fill in all fields");
          }
        } else {
          console.log("Network error:", err);
        }
      });
  },
};

export default userAPI;
