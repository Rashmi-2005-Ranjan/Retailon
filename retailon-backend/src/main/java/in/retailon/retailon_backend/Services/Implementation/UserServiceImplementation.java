package in.retailon.retailon_backend.Services.Implementation;

import in.retailon.retailon_backend.Entity.UserEntity;
import in.retailon.retailon_backend.IO.UserRequest;
import in.retailon.retailon_backend.IO.UserResponse;
import in.retailon.retailon_backend.Repositories.UserRepository;
import in.retailon.retailon_backend.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest request) {
        UserEntity newUser = convertToEntity ( request );
        newUser = userRepository.save ( newUser );
        return convertToResponse ( newUser );
    }

    private UserResponse convertToResponse(UserEntity newUser) {
        return UserResponse.builder ( )
                .name ( newUser.getName ( ) )
                .email ( newUser.getEmail ( ) )
                .role ( newUser.getRole ( ) )
                .userId ( newUser.getUserId ( ) )
                .createdAt ( newUser.getCreatedAt ( ) )
                .updatedAt ( newUser.getUpdatedAt ( ) )
                .build ( );
    }

    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder ( )
                .userId ( UUID.randomUUID ( ).toString ( ) )
                .email ( request.getEmail ( ) )
                .password ( passwordEncoder.encode ( request.getPassword ( ) ) )
                .role ( request.getRole ( ).toUpperCase ( ) )
                .name ( request.getName ( ) )
                .build ( );
    }

    @Override
    public String getUserRole(String email) {
        UserEntity userEntity = userRepository.findByEmail ( email )
                .orElseThrow ( () -> new UsernameNotFoundException ( "User Not Found For The Email: " + email ) );
        return userEntity.getRole ( );
    }

    @Override
    public List<UserResponse> readUsers() {
        return userRepository.findAll ( )
                .stream ( )
                .map ( this::convertToResponse )
                .collect ( Collectors.toList ( ) );
    }

    @Override
    public void deleteUser(String id) {
        UserEntity user = userRepository.findByUserId ( id )
                .orElseThrow ( () -> new UsernameNotFoundException ( "User Not Found With Id: " + id ) );
        userRepository.delete ( user );
    }
}
