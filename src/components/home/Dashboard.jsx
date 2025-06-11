function Dashboard(){
    return(
        <div>
            {/* <div className="user-box" id="user-box">
                <form method="post" className="logout">
                    <button className="logout-btn">LOG OUT</button>
                </form>
            </div> */}

            <section className="dashboard-container ">
                <div className="container text-center my-4">
                    <h1 className="fw-bold"> Dashboard Produk</h1>
                </div>
                    <div className="container mt-5">
                        <div className="row g-4">

                        <div className="col-md-6 col-lg-3">
                            <div className="card card-stat bg-primary text-white text-center p-4">
                            <div className="card-body">
                                <div className="display-6 mb-2"><i className="bi bi-basket"></i></div>
                                <h5 className="card-title">Total Pesanan</h5>
                                <p className="card-text fs-3 fw-semibold">123</p>
                            </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card card-stat bg-success text-white text-center p-4">
                            <div className="card-body">
                                <div className="display-6 mb-2"><i className="bi bi-box-seam"></i></div>
                                <h5 className="card-title">Product di tambahkan</h5>
                                <p className="card-text fs-3 fw-semibold">45</p>
                            </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card card-stat bg-warning text-dark text-center p-4">
                            <div className="card-body">
                                <div className="display-6 mb-2"><i className="bi bi-shield-lock"></i></div>
                                <h5 className="card-title">Total Admin</h5>
                                <p className="card-text fs-3 fw-semibold">2</p>
                            </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card card-stat bg-danger text-white text-center p-4">
                            <div className="card-body">
                                <div className="display-6 mb-2"><i className="bi bi-people"></i></div>
                                <h5 className="card-title">Total User</h5>
                                <p className="card-text fs-3 fw-semibold">78</p>
                            </div>
                            </div>
                        </div>

                </div>
            </div>
            </section>
        </div>
    )
}

export default Dashboard;