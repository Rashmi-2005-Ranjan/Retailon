package in.retailon.retailon_backend.Controller;

import com.razorpay.RazorpayException;
import in.retailon.retailon_backend.IO.OrderResponse;
import in.retailon.retailon_backend.IO.PaymentRequest;
import in.retailon.retailon_backend.IO.PaymentVerificationRequest;
import in.retailon.retailon_backend.IO.RazorpayOrderResponse;
import in.retailon.retailon_backend.Services.OrderService;
import in.retailon.retailon_backend.Services.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createOrder(@RequestBody PaymentRequest request) throws RazorpayException {
        return razorpayService.createOrder ( request.getAmount ( ) , request.getCurrency ( ) );
    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request){
        return orderService.verifyPayment ( request);
    }
}
