package in.retailon.retailon_backend.Services;

import in.retailon.retailon_backend.IO.UserRequest;
import in.retailon.retailon_backend.IO.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    String getUserRole(String email);
    List<UserResponse> readUsers();
    void deleteUser(String id);
}
