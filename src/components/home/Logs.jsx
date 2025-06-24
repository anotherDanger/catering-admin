import { useEffect, useState } from "react";
import { getLogs } from "../../api/logs.js";
function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs();
        if (data) {
          setLogs(data);
        } else {
          setError("Failed to fetch logs.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading logs...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">System Logs</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Timestamp</th>
              <th>Entity</th>
              <th>Level</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.entity}</td>
                <td>
                  <span
                    className={`badge ${
                      log.level === "error"
                        ? "bg-danger"
                        : log.level === "warn"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {log.level}
                  </span>
                </td>
                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Logs;
