import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Footer from "../footer";
import Header from "../header";
import productAPI from "../api/productAPI";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Purcharse(props) {
  const { order } = props;
  const [openDetail, setOpenDetail] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },

          backgroundColor: openDetail ? "rgb(192 186 186 / 18%)" : "none",
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenDetail(!openDetail)}
          >
            {openDetail ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {new Intl.DateTimeFormat("vi-VN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
            timeZone: "Asia/Ho_Chi_Minh",
          }).format(new Date(order.createdAt))}
        </TableCell>
        <TableCell align="right">{order["_id"]}</TableCell>
        <TableCell align="right">{order["paymentStatus"]}</TableCell>
        <TableCell align="right">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order["totalAmount"])}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openDetail} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Chi tiết đơn hàng
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell align="center">Loại sản phẩm</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="center">Giá thành</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order["products"].map((product) => (
                    <TableRow key={product["_id"]}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          maxWidth: 680,
                        }}
                      >
                        <img
                          className="w-[70px] h-[70px] p-2"
                          src={product.image}
                          alt=""
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {product.productName}
                        </div>
                      </TableCell>
                      <TableCell align="center">{product.category}</TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="center">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          Math.round(product.quantity * product.price * 100) /
                            100
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Purcharse.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const columnsHeader = [
  {
    id: "createAt",
    label: "Thời gian tạo đơn",
    minWidth: 200,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "code",
    label: "Mã đơn hàng",
    align: "right",
    minWidth: 150,
  },
  {
    id: "status",
    label: "Trạng thái đơn hàng",
    minWidth: 100,
    align: "right",
  },
  {
    id: "totalAmount",
    label: "Thành tiền (VNĐ)",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function ViewPurchase() {
  const [tabValue, setTabValue] = useState(0);

  const [purchaseOrderInfo, setPurchaseOrderInfo] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productAPI.handleGetPurchase();
        console.log(
          "🚀 ~ file: ViewPurchase.js:207 ~ fetchData ~ response:",
          response
        );
        setPurchaseOrderInfo([...response]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <div className="flex mb-24">
        <div className="Container mt-[50px] m-auto w-[1245px] px-4">
          <header
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
            }}
          >
            <h1 className="text-[42px] text-[#222] font-normal">
              Lịch sử mua hàng
            </h1>
          </header>
          <div className="mt-4">
            <table className="StatisticalProduct  border border-slate-300 border-collapse w-full max-md:flex">
              <thead className="border border-slate-300 bg-[#fbfbfb] max-md:hidden">
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label="Tất cả đơn hàng"
                    {...a11yProps(0)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  />
                  <Tab
                    label="Hoàn thành"
                    {...a11yProps(1)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  />
                  <Tab
                    label="Đã huỷ"
                    {...a11yProps(2)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  />
                </Tabs>
              </thead>
              <tbody className="border border-slate-300 max-md:w-full max-md:border-0"></tbody>
            </table>
          </div>
          <div className="mt-4">
            <CustomTabPanel value={tabValue} index={0}>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      {columnsHeader.map((column, index) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{
                            minWidth: column.minWidth,
                            fontWeight: "bold",
                            fontSize: "medium",
                          }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseOrderInfo.map((order, index) => (
                      <Purcharse key={index} order={order} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {columnsHeader.map((column, index) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          fontWeight: "bold",
                          fontSize: "medium",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrderInfo
                    .filter((order, index) => {
                      return order.paymentStatus === "Hoàn thành";
                    })
                    .map((order, index) => (
                      <Purcharse key={index} order={order} />
                    ))}
                </TableBody>
              </Table>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={2}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    {columnsHeader.map((column, index) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          fontWeight: "bold",
                          fontSize: "medium",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrderInfo
                    .filter((order, index) => {
                      return order.paymentStatus === "Đã huỷ";
                    })
                    .map((order, index) => (
                      <Purcharse key={index} order={order} />
                    ))}
                </TableBody>
              </Table>
            </CustomTabPanel>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default ViewPurchase;
