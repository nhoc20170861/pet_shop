const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Thay 'User' bằng tên model của người dùng nếu có
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: Number // Số lượng sản phẩm trong đơn hàng
            }
        ],
        totalAmount: Number,
        paymentStatus: {
            type: String,
            enum: ['Đã huỷ', 'Đang xử lý', 'Chưa giải quyết', 'Hoàn thành'], // Trạng thái thanh toán
            default: 'Đang xử lý'
        }
        // Thêm các trường khác nếu cần
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
