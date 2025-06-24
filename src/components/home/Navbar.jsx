import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("https://khatering.shop/v1/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.error("Logout failed:", err);
        }

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <Link className="navbar-brand fw-bold mx-5" to="/">🧭 Dashboard</Link>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                                <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/products">Product</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/orders">Order</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/logs">Logs</Link></li> {/* Tambahan Logs */}
                            </ul>

                            <ul className="navbar-nav mb-2 mb-lg-0 mx-5">
                                <li className="nav-item">
                                    <button className="nav-link text-danger bg-transparent border-0" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right"></i> Logout
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <i className="bi bi-person-circle fs-5" id="profile-icon"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
