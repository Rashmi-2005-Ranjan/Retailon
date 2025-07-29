package in.retailon.retailon_backend.Services.Implementation;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import in.retailon.retailon_backend.IO.OrderResponse;
import in.retailon.retailon_backend.IO.RazorpayOrderResponse;
import in.retailon.retailon_backend.Services.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImplementation implements RazorpayService {
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    public RazorpayOrderResponse createOrder(Double amount , String currency) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient ( razorpayKeyId , razorpayKeySecret );
        JSONObject orderRequest = new JSONObject ( );
        orderRequest.put ( "amount" , amount * 100 ); // Amount in paise
        orderRequest.put ( "currency" , currency );
        orderRequest.put ( "receipt" , "order_rcp_id_" + System.currentTimeMillis ( ) ); // Unique receipt ID
        orderRequest.put ( "payment_capture" , 1 ); // Auto capture
        Order order = razorpayClient.orders.create ( orderRequest );
        return convertToResponse ( order );
    }

    private RazorpayOrderResponse convertToResponse(Order order) {
        return RazorpayOrderResponse.builder ( )
                .id ( order.get ( "id" ) )
                .entity ( order.get ( "entity" ) )
                .amount ( order.get ( "amount" ) )
                .currency ( order.get ( "currency" ) )
                .receipt ( order.get ( "receipt" ) )
                .status ( order.get ( "status" ) )
                .createdAt ( order.get ( "created_at" ) )
                .build ( );
    }
}
