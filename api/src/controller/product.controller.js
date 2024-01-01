const moment = require('moment');
const mongoose = require('mongoose');
const querystring = require('qs');
const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const { config } = require('../config/config');
const { hashChecksum } = require('../utils/helper');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}
exports.getAllProduct = async (req, res) => {
    try {
        const allProduct = await Product.find();
        res.status(201).json({ allProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

exports.filterProduct = async (req, res) => {
    try {
        const { name } = req.body;
        const products = await Product.find({
            productName: { $regex: new RegExp(name, 'i') }
        });
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getProductByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getProductByID = async (req, res) => {
    try {
        const products = await Product.findById(req.params.id);
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json({ product, message: 'Update success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(201).json(`Product id ${req.params.id} has been deleted!!`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { productName, price, category, image } = req.body;

        const newProduct = new Product({ productName, price, category, image });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createPaymentUrl = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr = '127.0.0.1' || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const tmnCode = config.vnpay['vnp_TmnCode'];
    // const secretKey = config.vnpay['vnp_HashSecret'];
    var vnpUrl = config.vnpay['vnp_Url'];
    const returnUrl = config.vnpay['vnp_ReturnUrl'];

    const { amount, cartItems } = req.body;
    if (!amount || !cartItems) {
        return res.status(403).send({ message: err });
    }

    const bankCode = req.body.bankCode || 'VNBANK';
    const orderType = req.body.orderType || 'other';
    const locale = req.body.language || 'vn';
    const currCode = 'VND';

    try {
        const newOrderId = new mongoose.Types.ObjectId();
        const orderId = newOrderId.toString();
        const products = req.body.cartItems.map((item, index) => {
            return { _id: item['_id'], quantity: item['quantity'] };
        });

        const newOrder = new Order({
            _id: newOrderId,
            userId: req.user['id'],
            products,
            totalAmount: amount
        });
        const record = await newOrder.save();
        console.log('🚀createPaymentUrl= ~ record:', record);
        const orderInfo = orderId;

        // return to vnpay payment
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        // if (bankCode !== null && bankCode !== '') {
        //     vnp_Params['vnp_BankCode'] = bankCode;
        // }

        vnp_Params = sortObject(vnp_Params);
        vnp_Params['vnp_SecureHash'] = hashChecksum(vnp_Params);
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        // console.log('🚀 ~ file: product.controller.js:129 ~ exports.createPaymentUrl= ~ vnpUrl:', vnpUrl);

        res.set('Content-type', 'text/plain');
        return res.send({ RspCode: '00', Message: 'success', vnpUrl });
    } catch (error) {
        console.error('createPaymentUrl= ~ error:', error);
        res.status(500).send({ message: err });
        return;
    }
};

exports.handleVnpayIpnUrl = async (req, res) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var signed = hashChecksum(vnp_Params);

    if (secureHash === signed) {
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({ RspCode: '00', Message: 'success' });
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
    }
};
exports.handleVnpayReturn = async (req, res) => {
    var vnp_Params = req.query;
    console.log('🚀 ~ file: vnp_Params:', vnp_Params);

    var secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var signed = hashChecksum(vnp_Params);
    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        const rspCode = vnp_Params['vnp_ResponseCode'];

        const orderId = vnp_Params['vnp_OrderInfo'];
        let newPaymentStatus = '';
        if (rspCode === '24') {
            newPaymentStatus = 'Đã huỷ';
        } else if (rspCode === '00') {
            newPaymentStatus = 'Hoàn thành';
        }
        try {
            const record = await Order.updateOne(
                { _id: orderId },
                {
                    paymentStatus: newPaymentStatus
                }
            );
            return res.send({ RspCode: rspCode, Message: 'success' });
        } catch (error) {
            console.error('createPaymentUrl= ~ error:', error);
            res.status(500).send({ message: error });
            return;
        }
    } else {
        res.send({ Message: 'success', RspCode: '97' });
    }
};

exports.handleGetPurchase = async (req, res) => {
    try {
        // Lấy tất cả các đơn hàng của người dùng từ cơ sở dữ liệu

        console.log("🚀 ~ req.user['_id']:", req.user);
        const orders = await Order.find({ userId: req.user['id'] }).lean().sort({ createdAt: -1 });

        // Tạo một mảng mới để lưu thông tin đơn hàng và thông tin sản phẩm tương ứng
        const ordersWithProducts = [];

        // Duyệt qua từng đơn hàng
        for (const order of orders) {
            // Lấy thông tin sản phẩm từ đơn hàng
            const products = await Product.find({ _id: { $in: order.products } }).lean();

            // Tạo một object mới chứa thông tin đơn hàng và sản phẩm tương ứng
            const productsWithQuantity = products.map((product, index) => {
                return { ...product, quantity: order['products'][index].quantity };
            });
            // console.log('🚀 ~ file: product.controller.js:243 ~ productsWithQuantity ~ productsWithQuantity:', productsWithQuantity);
            const orderWithProducts = {
                ...order,
                _id: order['_id'].toString(),
                products: productsWithQuantity
            };

            // Thêm vào mảng kết quả
            ordersWithProducts.push(orderWithProducts);
        }

        res.json(ordersWithProducts);
    } catch (err) {
        console.error('🚀 handleGetPurchase= ~ err:', err);
        res.status(500).json({ message: err.message });
    }
};
