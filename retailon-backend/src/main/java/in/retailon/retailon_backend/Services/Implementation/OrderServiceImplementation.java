package in.retailon.retailon_backend.Services.Implementation;

import in.retailon.retailon_backend.Entity.OrderEntity;
import in.retailon.retailon_backend.Entity.OrderItemEntity;
import in.retailon.retailon_backend.IO.*;
import in.retailon.retailon_backend.Repositories.OrderEntityRepository;
import in.retailon.retailon_backend.Services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImplementation implements OrderService {
    private final OrderEntityRepository orderEntityRepository;


    @Override
    public OrderResponse createOrder(OrderRequest orderRequest) {
        OrderEntity newOrder = convertToOrderEntity ( orderRequest );

        PaymentDetails paymentDetails = new PaymentDetails ( );
        paymentDetails.setStatus ( newOrder.getPaymentMethod ( ) == PaymentMethod.CASH ? PaymentDetails.PaymentStatus.COMPLETED : PaymentDetails.PaymentStatus.PENDING );
        newOrder.setPaymentDetails ( paymentDetails );

        List<OrderItemEntity> orderItems = orderRequest.getCartItems ( )
                .stream ( )
                .map ( this::convertToOrderItemEntity )
                .collect ( Collectors.toList ( ) );

        newOrder.setItems ( orderItems );

        newOrder = orderEntityRepository.save ( newOrder );
        return convertToOrderResponse ( newOrder );
    }

    private OrderResponse convertToOrderResponse(OrderEntity newOrder) {
        return OrderResponse.builder ( )
                .orderId ( newOrder.getOrderId ( ) )
                .customerName ( newOrder.getCustomerName ( ) )
                .phoneNumber ( newOrder.getPhoneNumber ( ) )
                .subTotal ( newOrder.getSubTotal ( ) )
                .tax ( newOrder.getTax ( ) )
                .grandTotal ( newOrder.getGrandTotal ( ) )
                .paymentMethod ( newOrder.getPaymentMethod ( ) )
                .items ( newOrder.getItems ( ).stream ( )
                        .map ( this::convertToItemResponse )
                        .collect ( Collectors.toList ( ) )
                )
                .paymentDetails ( newOrder.getPaymentDetails ( ) )
                .createdAt ( newOrder.getCreatedAt ( ) )
                .build ( );
    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {
        return OrderResponse.OrderItemResponse.builder ( )
                .itemId ( orderItemEntity.getItemId ( ) )
                .name ( orderItemEntity.getName ( ) )
                .price ( orderItemEntity.getPrice ( ) )
                .quantity ( orderItemEntity.getQuantity ( ) )
                .build ( );
    }

    private OrderEntity convertToOrderEntity(OrderRequest request) {
        return OrderEntity.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .subTotal ( request.getSubTotal () )
                .tax(request.getTax())
                .grandTotal(request.getGrandTotal())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .build();
    }

    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {
        return OrderItemEntity.builder ( )
                .itemId ( orderItemRequest.getItemId ( ) )
                .name ( orderItemRequest.getName ( ) )
                .price ( orderItemRequest.getPrice ( ) )
                .quantity ( orderItemRequest.getQuantity ( ) )
                .build ( );
    }

    @Override
    public void deleteOrder(String orderId) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId ( orderId )
                .orElseThrow ( () -> new RuntimeException ( "Order with id " + orderId + " not found." ) );
        orderEntityRepository.delete ( existingOrder );
    }

    @Override
    public List<OrderResponse> getLatestOrders() {
        return orderEntityRepository.findAllByOrderByCreatedAtDesc ( )
                .stream ( )
                .map ( this::convertToOrderResponse )
                .collect ( Collectors.toList ( ) );
    }

    @Override
    public OrderResponse verifyPayment(PaymentVerificationRequest request) {
        OrderEntity existingOrder = orderEntityRepository.findByOrderId ( request.getOrderId ( ) )
                .orElseThrow ( () -> new RuntimeException ( "Order with id " + request.getOrderId ( ) + " not found." ) );
        if (!verifyRazorpaySignature ( request.getRazorpayOrderId ( ) , request.getRazorpayPaymentId ( ) , request.getRazorpaySignature ( ) )) {
            throw new RuntimeException ( "Payment Verification Failed" );
        }
        PaymentDetails paymentDetails = existingOrder.getPaymentDetails ( );
        paymentDetails.setStatus ( PaymentDetails.PaymentStatus.COMPLETED );
        paymentDetails.setRazorpayOrderId ( request.getRazorpayOrderId ( ) );
        paymentDetails.setRazorpayPaymentId ( request.getRazorpayPaymentId ( ) );
        paymentDetails.setRazorpaySignature ( request.getRazorpaySignature ( ) );
        existingOrder = orderEntityRepository.save ( existingOrder );
        return convertToOrderResponse ( existingOrder );
    }

    @Override
    public Double sumSalesByData(LocalDate date) {
        return orderEntityRepository.sumSalesByDate ( date );
    }

    @Override
    public Long countByOrderData(LocalDate date) {
        return orderEntityRepository
                .countByOrderDate ( date );
    }

    @Override
    public List<OrderResponse> findRecentOrders() {
        return orderEntityRepository.findRecentOrders ( PageRequest.of ( 0 , 5 ) )
                .stream ( )
                .map ( this::convertToOrderResponse )
                .collect ( Collectors.toList ( ) );
    }

    private boolean verifyRazorpaySignature(String razorpayOrderId , String razorpayPaymentId , String razorpaySignature) {
        return true;
    }

    // Actual Razorpay Signature Verification Industry Standard Code
    /**
    @Value("${razorpay.key.secret}")
    private String razorpaySecret;
    private boolean verifyRazorpaySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpaySecret.getBytes(), "HmacSHA256");
            mac.init(secretKey);
            byte[] digest = mac.doFinal(data.getBytes());
            String actualSignature = Base64.getEncoder().encodeToString(digest);
            return actualSignature.equals(razorpaySignature);
        } catch (Exception e) {
            System.out.println ( "Error verifying Razorpay signature: " + e.getMessage() );
            return false;
        }
    }
     */

}
