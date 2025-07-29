package in.retailon.retailon_backend.Repositories;

import in.retailon.retailon_backend.Entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemEntityRepository extends JpaRepository<OrderItemEntity, Long> {

}
