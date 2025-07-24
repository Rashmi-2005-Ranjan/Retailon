package in.retailon.retailon_backend.Controller;

import in.retailon.retailon_backend.IO.CategoryRequest;
import in.retailon.retailon_backend.IO.CategoryResponse;
import in.retailon.retailon_backend.Services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestBody CategoryRequest request) {
        return categoryService.add ( request );
    }

    @GetMapping
    public List<CategoryResponse> fetchCategories() {
        return categoryService.read ( );
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{categoryId}")
    public void remove(@PathVariable String categoryId) {
        try {
            categoryService.delete ( categoryId );
        } catch (Exception e) {
            throw new ResponseStatusException ( HttpStatus.NOT_FOUND , "Category Not Found With Id: " + categoryId + e.getMessage ( ) );
        }
    }
}
