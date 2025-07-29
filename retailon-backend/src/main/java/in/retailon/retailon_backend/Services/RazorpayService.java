package in.retailon.retailon_backend.Services;

import com.razorpay.RazorpayException;
import in.retailon.retailon_backend.IO.RazorpayOrderResponse;

public interface RazorpayService {
    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
