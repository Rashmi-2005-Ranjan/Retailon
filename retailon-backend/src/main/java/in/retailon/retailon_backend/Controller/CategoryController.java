package in.retailon.retailon_backend.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.retailon.retailon_backend.IO.CategoryRequest;
import in.retailon.retailon_backend.IO.CategoryResponse;
import in.retailon.retailon_backend.Services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@RequestPart("category") String categoryString , @RequestPart("file") MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper ( );
        CategoryRequest request = null;
        try {
            request = objectMapper.readValue ( categoryString , CategoryRequest.class );
            return categoryService.add ( request , file );
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException ( HttpStatus.BAD_REQUEST , "Exception Occurred While Parsing The JSON" + e.getMessage ( ) );
        }
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
