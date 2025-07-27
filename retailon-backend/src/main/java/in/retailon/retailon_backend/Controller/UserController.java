package in.retailon.retailon_backend.Controller;

import in.retailon.retailon_backend.IO.UserRequest;
import in.retailon.retailon_backend.IO.UserResponse;
import in.retailon.retailon_backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse registerUser(@RequestBody UserRequest userRequest) {
        try {
            return userService.createUser ( userRequest );
        } catch (Exception e) {
            throw new ResponseStatusException ( HttpStatus.BAD_REQUEST , "Unable To Create The User" + e.getMessage ( ) );
        }
    }

    @GetMapping("/users")
    public List<UserResponse> readUsers() {
        return userService.readUsers ( );
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUsers(@PathVariable String id) {
        try {
            userService.deleteUser ( id );
        } catch (Exception e) {
            throw new ResponseStatusException ( HttpStatus.NOT_FOUND , "User Not Found With ID: " + id , e );
        }
    }
}
