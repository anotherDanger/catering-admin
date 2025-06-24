import React, { useState, useEffect } from "react";
import getUsers, { getUserByUsername } from "../../api/users.js";

function displayLocalTimeAsWIB(isoString) {
  if (!isoString) return "-";
  const localString = isoString.endsWith('Z') ? isoString.slice(0, -1) : isoString;
  const date = new Date(localString);
  if (isNaN(date.getTime())) return "Invalid date";
  const options = {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("id-ID", options);
  const parts = formatter.formatToParts(date);
  const map = new Map(parts.map(part => [part.type, part.value]));
  const dateStr = `${map.get('day')} ${map.get('month')} ${map.get('year')}`;
  const timeStr = `${map.get('hour')}.${map.get('minute')}.${map.get('second')}`;
  return `${dateStr} pukul ${timeStr} WIB`;
}

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      setUsers(prev => prev.filter(user => user.id !== id));
      alert("User berhasil dihapus! (Secara lokal)");
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    const user = await getUserByUsername(search.trim());
    if (user) {
      setUsers([user]);
    } else {
      setUsers([]);
    }
    setSearching(false);
  };

  const handleReset = async () => {
    setSearch("");
    setLoading(true);
    const data = await getUsers();
    setUsers(data || []);
    setLoading(false);
  };

  if (loading || searching) return <p className="text-center mt-5">Loading users...</p>;

  return (
    <section>
      <div className="container">
        <h2 className="text-center my-5">Users</h2>

        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by username"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="btn btn-primary" type="button" onClick={handleSearch}>
                Search
              </button>
              <button className="btn btn-secondary" type="button" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="row mx-2 justify-content-center">
          {users.length === 0 && <p className="text-center">No users found.</p>}
          {users.map(user => (
            <div className="col-md-4 text-center" key={user.id}>
              <div className="card text-center p-4 mb-4">
                <div className="card-body">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>First Name:</strong> {user.first_name}</p>
                  <p><strong>Last Name:</strong> {user.last_name}</p>
                  <p><strong>Last Accessed:</strong> {displayLocalTimeAsWIB(user.last_accessed)}</p>
                  <button type="button" className="btn btn-danger mt-2" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Users;
