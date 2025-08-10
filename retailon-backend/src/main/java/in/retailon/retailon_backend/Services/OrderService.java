package in.retailon.retailon_backend.Services;

import in.retailon.retailon_backend.IO.OrderRequest;
import in.retailon.retailon_backend.IO.OrderResponse;
import in.retailon.retailon_backend.IO.PaymentVerificationRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest orderRequest);

    void deleteOrder(String orderId);

    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByData(LocalDate date);

    Long countByOrderData(LocalDate date);

    List<OrderResponse> findRecentOrders();
}
