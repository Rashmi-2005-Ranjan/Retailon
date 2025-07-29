package in.retailon.retailon_backend.Services;

import in.retailon.retailon_backend.Entity.ItemEntity;
import in.retailon.retailon_backend.IO.ItemRequest;
import in.retailon.retailon_backend.IO.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {
    ItemResponse add(ItemRequest request, MultipartFile file);

    List<ItemResponse> fetchItems();

    void deleteItem(String itemId);
}
