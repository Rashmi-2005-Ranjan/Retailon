package in.retailon.retailon_backend.Services.Implementation;

import in.retailon.retailon_backend.Entity.CategoryEntity;
import in.retailon.retailon_backend.Entity.ItemEntity;
import in.retailon.retailon_backend.IO.ItemRequest;
import in.retailon.retailon_backend.IO.ItemResponse;
import in.retailon.retailon_backend.Repositories.CategoryRepository;
import in.retailon.retailon_backend.Repositories.ItemRepository;
import in.retailon.retailon_backend.Services.FileUploadService;
import in.retailon.retailon_backend.Services.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImplementation implements ItemService {

    private final FileUploadService fileUploadService;
    private final CategoryRepository categoryRepository;
    private final ItemRepository itemRepository;

    @Override
    public ItemResponse add(ItemRequest request , MultipartFile file) {
        String imgUrl = fileUploadService.uploadFile ( file );
        ItemEntity newItem = convertToEntity ( request );
        CategoryEntity existingCategory = categoryRepository.findByCategoryId ( request.getCategoryId ( ) )
                .orElseThrow ( () -> new RuntimeException ( "Category Not Found: " + request.getCategoryId ( ) ) );
        newItem.setCategory ( existingCategory );
        newItem.setImgUrl ( imgUrl );
        newItem = itemRepository.save ( newItem );
        return convertToResponse ( newItem );
    }

    private ItemResponse convertToResponse(ItemEntity newItem) {
        return ItemResponse.builder ( )
                .itemId ( newItem.getItemId ( ) )
                .name ( newItem.getName ( ) )
                .description ( newItem.getDescription ( ) )
                .price ( newItem.getPrice ( ) )
                .imgUrl ( newItem.getImgUrl ( ) )
                .categoryName ( newItem.getCategory ( ).getName ( ) )
                .categoryId ( newItem.getCategory ( ).getCategoryId ( ) )
                .createdAt ( newItem.getCreatedAt ( ) )
                .updatedAt ( newItem.getUpdatedAt ( ) )
                .build ( );
    }

    private ItemEntity convertToEntity(ItemRequest request) {
        return ItemEntity.builder ( )
                .itemId ( UUID.randomUUID ( ).toString ( ) )
                .name ( request.getName ( ) )
                .description ( request.getDescription ( ) )
                .price ( request.getPrice ( ) )
                .build ( );
    }

    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepository.findAll ( )
                .stream ( )
                .map ( this::convertToResponse )
                .collect ( Collectors.toList ( ) );
    }

    @Override
    public void deleteItem(String itemId) {
        ItemEntity item = itemRepository.findByItemId ( itemId )
                .orElseThrow ( () -> new RuntimeException ( "Item Not Found: " + itemId ) );
        boolean isDeleted = fileUploadService.deleteFile ( item.getImgUrl ( ) );
        if (isDeleted) {
            itemRepository.delete ( item );
        } else {
            throw new ResponseStatusException ( HttpStatus.INTERNAL_SERVER_ERROR , "Unable To Delete The Image" );
        }
    }
}
