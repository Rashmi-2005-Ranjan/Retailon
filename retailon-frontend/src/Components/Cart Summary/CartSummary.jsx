import {useContext, useState} from "react";
import {AppContext} from "../../Context/AppContext.jsx";
import {createOrder, deleteOrder} from "../../Services/OrderService.js";
import toast from "react-hot-toast";
import {createRazorpayOrder, verifyPayment} from "../../Services/PaymentService.js";
import {AppConstants} from "../../Util/constant.js";
import ReceiptPopUp from "../Receipt Pop Up/ReceiptPopUp.jsx";


const CartSummary = ({customerName, mobileNumber, setMobileNumber, setCustomerName}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const {cartItems, clearCart} = useContext(AppContext);
    const [showPopup, setShowPopup] = useState(false);
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = totalAmount * 0.01;
    const grandTotal = totalAmount + tax;

    const loadRazorPayScript = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        })
    }
    const clearAll = () => {
        setCustomerName("");
        setMobileNumber("");
        clearCart();
    }
    const placeOrder = () => {
        setShowPopup(true);
        clearAll();
    }
    const handlePrintReceipt = () => {
        window.print();
    }
    const deleteOrderOnFailure = async (orderId) => {
        try {
            await deleteOrder(orderId);
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error("Something Went Wrong!")
        }
    }
    const completePayment = async (paymentMode) => {
        if (!customerName || !mobileNumber) {
            toast.error("Please fill all the details!");
        }
        if (cartItems.length === 0) {
            toast.error("Cart is empty!");
        }
        setIsProcessing(true);
        const orderData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subTotal: totalAmount,
            tax,
            grandTotal,
            paymentMethod: paymentMode.toUpperCase()
        }
        try {
            const response = await createOrder(orderData);
            const savedData = response.data
            if (response.status === 201 && paymentMode === "cash") {
                toast.success("Cash Received");
                setIsProcessing(false);
                setOrderDetails(savedData);
            } else if (response.status === 201 && paymentMode === "upi") {
                const razorPayLoaded = await loadRazorPayScript();
                if (!razorPayLoaded) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    await deleteOrderOnFailure(savedData.orderId);
                    return;
                }
                const razorPayResponse = await createRazorpayOrder({amount: grandTotal, currency: "INR"})
                const options = {
                    key: AppConstants.RAZORPAY_KEY_ID,
                    amount: razorPayResponse.data.amount,
                    currency: razorPayResponse.data.currency,
                    order_id: razorPayResponse.data.id,
                    name: "MY ELECTRONICS STORE",
                    description: "Order Payment",
                    handler: async function (response) {
                        await verifyPaymentHandler(response, savedData);
                    }
                    , prefill: {
                        name: customerName,
                        contact: mobileNumber,
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: async function () {
                            await deleteOrderOnFailure(savedData.orderId);
                            toast.error("Payment Cancelled");
                        }
                    }
                }
                const razorPay = new window.Razorpay(options);
                razorPay.on("payment.failed", async (response) => {
                    await deleteOrderOnFailure(savedData.orderId);
                    toast.error("Payment Failed");
                    console.error(response.error.description);
                })
                razorPay.open();
            }
        } catch (error) {
            console.error(error);
            toast.error("Payment Processing Failed");
        } finally {
            setIsProcessing(false);
        }
    }
    const verifyPaymentHandler = async (response, savedOrder) => {
        const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: savedOrder.orderId
        };
        try {
            const paymentResponse = await verifyPayment(paymentData);
            if (paymentResponse.status === 200) {
                toast.success("Payment Successful");
                setOrderDetails({
                    ...savedOrder,
                    paymentDetails: {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature
                    },
                });
            } else {
                toast.error("Payment Failed");
            }
        } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment Failed");
        }
    };
    return (
        <div className="mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Item: </span>
                    <span className="text-light">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Tax (1%):</span>
                    <span className="text-light">₹{tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light">Total:</span>
                    <span className="text-light">₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="d-flex gap-3">
                <button
                    className="flex-grow-1 btn btn-success"
                    disabled={isProcessing}
                    onClick={() => completePayment("cash")}>
                    {isProcessing ? "Processing..." : "Cash"}
                </button>
                <button disabled={isProcessing}
                        className="btn btn-primary flex-grow-1" onClick={() => completePayment("upi")}>
                    {isProcessing ? "Processing..." : "UPI"}
                </button>
            </div>
            <div className="d-flex gap-3 mt-3">
                <button className="btn btn-warning flex-grow-1"
                        disabled={isProcessing || !orderDetails}
                        onClick={placeOrder}>
                    Place Order
                </button>
            </div>
            {
                showPopup && (
                    <ReceiptPopUp
                        orderDetails={{
                            ...orderDetails,
                            razorpayOrderId: orderDetails.paymentDetails?.razorpayOrderId,
                            razorpayPaymentId: orderDetails.paymentDetails?.razorpayPaymentId,
                        }}
                        onClose={() => {
                            setShowPopup(false);
                        }}
                        onPrint={handlePrintReceipt}
                    />
                )
            }
        </div>
    )
}

export default CartSummary;