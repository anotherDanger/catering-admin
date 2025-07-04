import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { getOrders } from "../../api/orders.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const data = await getOrders();
      if (data) {
        setOrders(data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  const orderCountPerDate = orders.reduce((acc, order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(orderCountPerDate).sort();

  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Jumlah Order per Hari",
        data: sortedDates.map((date) => orderCountPerDate[date]),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Grafik Order berdasarkan Waktu" }
    },
    scales: {
      x: { title: { display: true, text: "Tanggal" } },
      y: {
        title: { display: true, text: "Jumlah Order" },
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
          callback: (value) => Number.isInteger(value) ? value : null,
        }
      }
    }
  };

  return (
    <div>
      <section className="dashboard-container">
        <div className="container text-center my-4">
          <h1 className="fw-bold">Dashboard Produk</h1>
        </div>
        <div className="container mt-5">
          {/* <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card card-stat bg-primary text-white text-center p-4">
                <div className="card-body">
                  <div className="display-6 mb-2"><i className="bi bi-basket"></i></div>
                  <h5 className="card-title">Total Pesanan</h5>
                  <p className="card-text fs-3 fw-semibold">{orders.length}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card card-stat bg-success text-white text-center p-4">
                <div className="card-body">
                  <div className="display-6 mb-2"><i className="bi bi-box-seam"></i></div>
                  <h5 className="card-title">Produk Ditambahkan</h5>
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
          </div> */}

          <div className="mt-5">
            <Line data={chartData} options={options} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
