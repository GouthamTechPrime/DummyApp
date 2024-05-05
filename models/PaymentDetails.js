const mongoose = require("mongoose");
const PaymentDetailsSchema = mongoose.Schema({
  orderId: { type: String },
  orderDetails: {
    medicineName: { type: String },
    quantity: { type: String },
  },
  orderTotal: { type: String },
  Price: { type: String },
  orderStatus: { type: String },
  orderNature: { type: String }, //code, op
  customerId: { type: String },
  mobileNumber: { type: String },
  merchantId: { type: String },
  merchantTransactionId: { type: String },
  merchantUserId: { type: String },
  amount: { type: String },
});

module.exports = PaymentDetails = mongoose.model(
  "payment detail",
  PaymentDetailsSchema
);
