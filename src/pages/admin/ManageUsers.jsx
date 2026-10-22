
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/users`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to load users");
      }

      const list = data.users ?? data.data?.users ?? data.data ?? [];
      setUsers(list.filter((user) => user.role === "customer" || user.role === "user"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user) => {
    const currentlyActive = user.isActive !== false;

    if (!window.confirm(
      `${currentlyActive ? "Deactivate" : "Activate"} ${user.name}?`
    )) return;

    try {
      setBusyId(user._id);
      setError("");

      const res = await fetch(`${API}/users/${user._id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentlyActive }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to update user");
      }

      setUsers((prev) =>
        prev.map((item) =>
          item._id === user._id
            ? { ...item, isActive: !currentlyActive }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    const matchesSearch =
      (user.name || "").toLowerCase().includes(query) ||
      (user.email || "").toLowerCase().includes(query);

    const active = user.isActive !== false;
    const matchesStatus =
      status === "all" ||
      (status === "active" && active) ||
      (status === "inactive" && !active);

    return matchesSearch && matchesStatus;
  });

  const activeCount = users.filter((u) => u.isActive !== false).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Users
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage customer accounts.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Customers" value={users.length} icon={<Users />} />
          <StatCard title="Active Customers" value={activeCount} icon={<UserCheck />} />
          <StatCard title="Inactive Customers" value={users.length - activeCount} icon={<UserX />} />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          {loading ? (
            <p className="p-10 text-center text-gray-500">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="p-10 text-center text-gray-500">No customers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => {
                    const active = user.isActive !== false;

                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {user.name || "Unnamed"}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {user.phone || "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            disabled={busyId === user._id}
                            onClick={() => toggleStatus(user)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                              active
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {busyId === user._id
                              ? "Updating..."
                              : active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between text-gray-500">
        <span className="text-sm">{title}</span>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
