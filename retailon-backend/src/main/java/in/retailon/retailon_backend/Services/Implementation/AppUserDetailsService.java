package in.retailon.retailon_backend.Services.Implementation;

import in.retailon.retailon_backend.Entity.UserEntity;
import in.retailon.retailon_backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail ( email )
                .orElseThrow ( () -> new UsernameNotFoundException ( "Email not found: " + email ) );
        return new User ( userEntity.getEmail ( ) , userEntity.getPassword ( ) , Collections.singleton ( new SimpleGrantedAuthority ( userEntity.getRole ( ) ) ) );
    }
}
