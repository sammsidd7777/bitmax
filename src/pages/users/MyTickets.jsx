
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/tickets/my-tickets`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load tickets");
        }

        const list =
          result.tickets ??
          result.data?.tickets ??
          result.data ??
          [];

        setTickets(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = [
      ticket.ticketNumber,
      ticket.subject,
      ticket.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "all" ||
      (ticket.status || "").toLowerCase() === status;

    return matchesSearch && matchesStatus;
  });

  const statusStyle = (value = "") => {
    const styles = {
      open: "bg-blue-100 text-blue-700",
      pending: "bg-amber-100 text-amber-700",
      "in progress": "bg-purple-100 text-purple-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-slate-200 text-slate-700",
    };

    return styles[value.toLowerCase()] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your support requests and replies.
          </p>
        </div>

        <Link
          to="/user/create-ticket"
          className="rounded-lg bg-blue-600 px-5 py-3 text-center
            text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Create Ticket
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Total Tickets</p>
          <p className="mt-2 text-2xl font-bold">{tickets.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Open / Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {tickets.filter((t) =>
              ["open", "pending", "in progress"].includes(
                (t.status || "").toLowerCase()
              )
            ).length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Resolved / Closed</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {tickets.filter((t) =>
              ["resolved", "closed"].includes(
                (t.status || "").toLowerCase()
              )
            ).length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by ticket number or subject..."
          className="w-full rounded-lg border border-slate-300 bg-white
            px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500">
          Loading tickets...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {filteredTickets.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-slate-700">
                No tickets found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Try another search or create a new ticket.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Ticket ID</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-medium text-blue-600">
                        {ticket.ticketNumber || ticket._id}
                      </td>
                      <td className="px-5 py-4 font-medium">
                        {ticket.subject}
                      </td>
                      <td className="px-5 py-4 capitalize">
                        {ticket.priority || "Normal"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold
                            capitalize ${statusStyle(ticket.status)}`}
                        >
                          {(ticket.status || "open").replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/user/tickets/${ticket._id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
