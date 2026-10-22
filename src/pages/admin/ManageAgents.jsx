
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Headset,
  UserCheck,
  UserX,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function ManageAgents() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/users/agents`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to load agents");
      }

      setAgents(data.agents ?? data.data?.agents ?? data.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const toggleStatus = async (agent) => {
    const currentlyActive = agent.isActive !== false;

    if (!window.confirm(
      `${currentlyActive ? "Deactivate" : "Activate"} ${agent.name}?`
    )) return;

    try {
      setBusyId(agent._id);
      setError("");

      const res = await fetch(`${API}/users/${agent._id}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentlyActive }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to update agent");
      }

      setAgents((prev) =>
        prev.map((item) =>
          item._id === agent._id
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

  const filteredAgents = agents.filter((agent) => {
    const query = search.toLowerCase();

    const matchesSearch =
      (agent.name || "").toLowerCase().includes(query) ||
      (agent.email || "").toLowerCase().includes(query);

    const active = agent.isActive !== false;
    const matchesStatus =
      status === "all" ||
      (status === "active" && active) ||
      (status === "inactive" && !active);

    return matchesSearch && matchesStatus;
  });

  const activeCount = agents.filter((a) => a.isActive !== false).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Agents
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your support team and agent accounts.
            </p>
          </div>

          <button
            onClick={fetchAgents}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Agents" value={agents.length} icon={<Headset />} />
          <StatCard title="Active Agents" value={activeCount} icon={<UserCheck />} />
          <StatCard title="Inactive Agents" value={agents.length - activeCount} icon={<UserX />} />
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
              placeholder="Search agent name or email..."
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
            <p className="p-10 text-center text-gray-500">Loading agents...</p>
          ) : filteredAgents.length === 0 ? (
            <p className="p-10 text-center text-gray-500">No agents found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Agent</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAgents.map((agent) => {
                    const active = agent.isActive !== false;

                    return (
                      <tr key={agent._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900">
                            {agent.name || "Unnamed"}
                          </p>
                          <p className="text-sm text-gray-500">{agent.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {agent.phone || "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          {agent.createdAt
                            ? new Date(agent.createdAt).toLocaleDateString()
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
                            disabled={busyId === agent._id}
                            onClick={() => toggleStatus(agent)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                              active
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {busyId === agent._id
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
