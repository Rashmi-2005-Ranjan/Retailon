import "./Login.css";
import {useContext, useState} from "react";
import toast from "react-hot-toast";
import {login} from "../../Services/AuthService.js";
import {useNavigate} from "react-router-dom";
import {AppContext} from "../../Context/AppContext.jsx";

const Login = () => {
    const {setAuthData} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData(data => ({
            ...data, [name]: value
        }))
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate an API call
            const response = await  login(data);
            if (response.status === 200) {
                toast.success("Login Successful");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                setAuthData(response.data.token,response.data.role);
                navigate("/dashboard");
            }
            // Handle successful login here
        } catch (error) {
            console.error(error);
            toast.error("Email/Password Invalid",error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light d-flex align-items-center justify-content-center vh-100 login-background">
            <div className="transparent-card card shadow-lg w-100" style={{maxWidth: "480px"}}>
                <div className="card-body">
                    <div className="text-center">
                        <h1 className="card-title">Sign In</h1>
                        <p className="card-text text-muted">
                            Sign In Below To Access Your Account
                        </p>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-envelope-fill"></i>
                                    </span>
                                    <input
                                        onChange={onChangeHandler}
                                        value={data.email}
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-lock-fill"></i>
                                    </span>
                                    <input
                                        onChange={onChangeHandler}
                                        value={data.password}
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading?"Loading...":"Sign In"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
