package in.retailon.retailon_backend.Services;

import in.retailon.retailon_backend.IO.CategoryRequest;
import in.retailon.retailon_backend.IO.CategoryResponse;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Repository
public interface CategoryService {
    CategoryResponse add(CategoryRequest request, MultipartFile file);
    List<CategoryResponse> read();
    void delete(String categoryId);
}
