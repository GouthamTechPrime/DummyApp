const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const PaymentDetails = require("./models/PaymentDetails");
const PaymentModel = require("./models/DummyModel");
var instance = new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_SECRET });

//Generating unique token
// const generateUniqueToken = (userId) => {
//   // Your secret key (keep it secure, and do not expose it)
//   const secretKey = 'your_secret_key';

//   // User-specific information (you can customize this based on your needs)
//   const userInfo = {
//     userId,
//     timestamp: Date.now(),
//   };

//   // Create a unique token using HMAC (Hash-based Message Authentication Code)
//   const hmac = crypto.createHmac('sha256', secretKey);
//   hmac.update(JSON.stringify(userInfo));
//   const token = hmac.digest('hex');

//   return token;
// };
router.post("/makeNewPayment",async(req,res)=>{
  const {orderTotal,customerId,notes} = req.body;
    try {
      // const thresholdAmount = 10
      if(!orderTotal || !customerId){
        //save details in fail payment model  (customerId,orderTotals,)
        return res.status(400).json({message : "Please Provide All Required Fields",status:"Fail",created:false})
      }
      instance.orders.create({
        "amount":orderTotal, //1 rupeee
        "currency": "INR",
        "receipt": customerId,
        "partial_payment": false,
        "notes": notes
      }).then((data)=>{

        console.log("Response - ",data); 
        //orderId ->frontend
        return res.status(200).json({data : data,status:"Success",message:"Payment Initiated Successfully"})

      }
      ).catch((err)=>{
        console.log("Error Occurred while creating order");
        return res.status(400).json({message : "Error Occurred",status:"Fail"})
      })
     
        
    } catch (error) {
      console.log("Error Occurred",error)
      return res.status(400).json({message : "Error Occurred",status:"Fail"})

    }
})
// router.get("/personDetails",async(req,res)=>{
//   try {
//     const isUser = await Auth.findById({_id : req.body.id})
//     if(isUser){
//       return res.send(isUser);

//     }else{
//       return res.send("No User Found")
//     }
//   } catch (error) {
//     return res.send("Error Ocurred",error.message)
//   }
// })
router.put("/getData",async(req,res)=>{
  try {
    const {orderId,orderDetails,orderTotal,orderStatus,orderNature,customerId,mobileNumber,paymentId,razorPayOrderId,successData} = req.body;
    // const isExistedUser = AuthController.getCurrentPersonDetails(userId);
    // const isExistedUser = await Auth.findById({_id : userId});
    console.log("Triggered getData route")
    // console.log("Current User ID- ",userId);
    // console.log("Current Order ID  ",orderId);
   
    //   console.log("user id - ",userId);
      console.log("Payment Id - ",paymentId);
      console.log("razorPay Id - ",razorPayOrderId);
      console.log("successData - ",successData);
      // console.log("order Id",currentOrderId);
      console.log("payment Id",successData.razorpay_payment_id);
      const payload = successData.razorpay_order_id + '|' + successData.razorpay_payment_id;
      // const generated_signature = hmac_sha256(currentOrderId + "|" + successData.razorpay_payment_id, process.env.RAZORPAY_SECRET);
  
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
      hmac.update(payload);
      const generated_signature = hmac.digest('hex');
      
      console.log('Generated Signature:',generated_signature);
  
      if(generated_signature === successData.razorpay_signature){


        const payment = new PaymentModel({
          orderId : orderId,
          orderDetails : orderDetails,
          orderTotal : orderTotal,
          orderStatus : orderStatus,
          orderNature : orderNature,
          customerId : customerId,
          mobileNumber : mobileNumber,
          paymentStatus : "sucessful",
          paymentId : paymentId
        });
        const savePayment = await payment.save();

        //implement required features
        // isExistedUser.isAuthenticated = true;
        // const uniqueToken = generateUniqueToken(userId);
        // isExistedUser.uniqueToken = uniqueToken;
        // await isExistedUser.save();
        // console.log("Current Person Status - ",isExistedUser.isAuthenticated);

        // const currentDate = new Date();
        // const expireDate = new Date(currentDate);
        // expireDate.setFullYear(currentDate.getFullYear() + 1);
        // const newAuthorizedUser = new AuthorizedUsers({userId : userId,createdAt : currentDate,validUpto:expireDate});
        // await newAuthorizedUser.save();
        // Email.sendEmail(userEmail,1000,successData.razorpay_payment_id,userName,uniqueToken);
        console.log("save payment - ",savePayment);
        return res.status(200).json({status:"Payment Successful",data : payment});
       
      }else{

        // save karna 
        const payment = new PaymentModel({
          orderId : orderId,
          orderDetails : orderDetails,
          orderTotal : orderTotal,
          orderStatus : orderStatus,
          orderNature : orderNature,
          customerId : customerId,
          mobileNumber : mobileNumber,
          paymentStatus : "fail",
          paymentId : paymentId
        });
        const savePayment = await payment.save();
        console.log("save payment - ",savePayment);

        return res.status(200).json({status:"Payment Unsuccessful",data : payment});

      }
   
  
  } catch (error) {
    return res.send("Error Occurred!"+error.message)
    
  }
});

router.post("/saveOrderDetails",async(req,res)=>{
  const merchantId = "LaRqqjIfsV1vLO"
  try {
    const {orderId,orderDetails,orderTotal,Price,orderStatus,orderNature,customerId,mobileNumber} = req.body;
    const newOrder = new PaymentDetails({orderId,orderDetails,orderTotal,Price,orderStatus,orderNature,customerId,mobileNumber
    ,merchantId:merchantId,merchantTransactionId: orderId,merchantUserId: customerId,amount : orderTotal});
    await newOrder.save();
    return res.status(200).json({
      message : "New Order Created Successfully",
      response : newOrder
    });

  } catch (error) {
    return res.send("Error Occurred!"+error.message)
    
  }
})

module.exports = router;