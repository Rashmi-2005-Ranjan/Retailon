package in.retailon.retailon_backend.Controller;

import in.retailon.retailon_backend.IO.AuthRequest;
import in.retailon.retailon_backend.IO.AuthResponse;
import in.retailon.retailon_backend.Services.Implementation.AppUserDetailsService;
import in.retailon.retailon_backend.Services.UserService;
import in.retailon.retailon_backend.Util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) throws Exception {
        authenticate ( authRequest.getEmail ( ) , authRequest.getPassword ( ) );
        final UserDetails userDetails = appUserDetailsService.loadUserByUsername ( authRequest.getEmail ( ) );
        final String jwtToken = jwtUtil.generateToken ( userDetails );
        String userRole = userService.getUserRole ( authRequest.getEmail ( ) );
        return new AuthResponse ( authRequest.getEmail ( ) , jwtToken , userRole );
    }

    private void authenticate(String email , String password) throws Exception {
        try {
            authenticationManager.authenticate ( new UsernamePasswordAuthenticationToken ( email , password ) );
        } catch (DisabledException e) {
            throw new Exception ( "User is disabled" , e );
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException ( HttpStatus.BAD_REQUEST , "Email or Password is incorrect" , e );
        }
    }

    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String, String> request) {
        return passwordEncoder.encode ( request.get ( "password" ) );
    }
}
