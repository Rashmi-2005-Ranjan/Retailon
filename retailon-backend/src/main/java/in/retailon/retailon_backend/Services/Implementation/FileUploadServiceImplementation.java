package in.retailon.retailon_backend.Services.Implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import in.retailon.retailon_backend.Services.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImplementation implements FileUploadService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            // Upload file to Cloudinary inside a folder named "retailon_images"
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "retailon_images",
                            "resource_type", "auto" // handles images, videos, etc.
                    )
            );

            // Return the Cloudinary secure URL (https)
            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "An error occurred while uploading the file to Cloudinary",
                    e
            );
        }
    }

    @Override
    public boolean deleteFile(String imgUrl) {
        try {
            // Extract public_id from the URL
            String[] parts = imgUrl.split("/");
            String fileName = parts[parts.length - 1];
            String publicId = "retailon_images/" + fileName.substring(0, fileName.lastIndexOf('.'));

            // Delete from Cloudinary
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return true;

        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "An error occurred while deleting the file from Cloudinary",
                    e
            );
        }
    }
}