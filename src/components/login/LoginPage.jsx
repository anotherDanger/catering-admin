import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div 
            className="d-flex justify-content-center align-items-center" 
            style={{ 
                minHeight: '100vh', 
            }}
        >
            <section className="login-container w-100 p-3">
                <div className="container text-center my-4">
                    <h1 className="fw-bold">Login Admin</h1>
                </div>
                <div className="container-fluid mt-3">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4"> 
                            <div className="card shadow-lg p-4" style={{ borderRadius: '15px' }}>
                                <div className="card-body">
                                    <div className="display-6 mb-4 text-center text-primary">
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <h5 className="card-title text-center mb-4">Masuk ke Dashboard</h5>
                                    
                                    <form className="login-form" onSubmit={handleSubmit}>
                                        {error && <div className="alert alert-danger mb-3">{error}</div>}

                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label visually-hidden">Username</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    placeholder="Username atau Email"
                                                    required
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label visually-hidden">Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <button type="submit" className="btn btn-primary btn-lg">Login</button>
                                        </div>
                                    </form>
                                    
                                    <div className="text-center mt-3">
                                        <a href="#" className="text-decoration-none">Lupa Password?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;