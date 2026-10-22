
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserRoundPlus,
  RefreshCw,
  Ticket,
  AlertCircle,
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function UnassignedTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAgents, setSelectedAgents] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/tickets/unassigned`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load tickets");
      }

      setTickets(
        data.tickets ?? data.data?.tickets ?? data.data ?? []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAgents = async () => {
    try {
      const res = await fetch(`${API}/users/agents`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load agents");
      }

      setAgents(data.agents ?? data.data?.agents ?? data.data ?? []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    getTickets();
    getAgents();
  }, []);

  const assignTicket = async (ticketId) => {
    const agentId = selectedAgents[ticketId];

    if (!agentId) {
      setError("Please select a support agent first.");
      return;
    }

    try {
      setAssigningId(ticketId);
      setError("");
      setSuccess("");

      const res = await fetch(
        `${API}/tickets/${ticketId}/assign`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agentId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ticket assignment failed");
      }

      setTickets((prev) =>
        prev.filter((ticket) => ticket._id !== ticketId)
      );

      setSuccess("Ticket assigned successfully.");
      setSelectedAgents((prev) => {
        const updated = { ...prev };
        delete updated[ticketId];
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setAssigningId(null);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.toLowerCase();

    const matchesSearch =
      (ticket.ticketNumber || "").toLowerCase().includes(query) ||
      (ticket.subject || "").toLowerCase().includes(query) ||
      (ticket.requesterEmail || ticket.requesterId?.email || "")
        .toLowerCase()
        .includes(query);

    const matchesPriority =
      priority === "all" || ticket.priority === priority;

    return matchesSearch && matchesPriority;
  });

  const priorityStyle = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Unassigned Tickets
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Assign pending tickets to the right support agent.
            </p>
          </div>

          <button
            onClick={() => {
              getTickets();
              getAgents();
            }}
            className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Unassigned Tickets</p>
              <Ticket className="text-blue-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold">{tickets.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Available Agents</p>
              <UserRoundPlus className="text-green-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold">{agents.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Urgent Tickets</p>
              <AlertCircle className="text-red-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {tickets.filter((t) => t.priority === "urgent").length}
            </p>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticket number, subject, or email..."
              className="w-full rounded-lg border bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Tickets */}
        <div className="overflow-hidden rounded-xl border bg-white">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading unassigned tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <Ticket className="mx-auto mb-3 text-gray-300" size={40} />
              <h3 className="font-semibold text-gray-800">
                No unassigned tickets found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                All matching tickets may already be assigned.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Ticket</th>
                    <th className="px-5 py-4">Requester</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4">Assign Agent</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            navigate(`/admin/tickets/${ticket._id}`)
                          }
                          className="text-left"
                        >
                          <p className="font-semibold text-blue-600 hover:underline">
                            {ticket.ticketNumber || ticket._id}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-sm text-gray-600">
                            {ticket.subject}
                          </p>
                        </button>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {ticket.requesterEmail ||
                          ticket.requesterId?.email ||
                          "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            priorityStyle[ticket.priority] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {ticket.priority || "medium"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={selectedAgents[ticket._id] || ""}
                          onChange={(e) =>
                            setSelectedAgents((prev) => ({
                              ...prev,
                              [ticket._id]: e.target.value,
                            }))
                          }
                          className="w-48 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">Select agent</option>
                          {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name} ({agent.email})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          disabled={assigningId === ticket._id}
                          onClick={() => assignTicket(ticket._id)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {assigningId === ticket._id
                            ? "Assigning..."
                            : "Assign"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
