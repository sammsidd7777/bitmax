
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Ticket,
  Clock,
  CheckCircle2,
  Eye,
  Inbox,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AssignedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const fetchAssignedTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/tickets/agent/my-tickets`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Assigned tickets load nahi hue"
        );
      }

      const list =
        data.tickets ??
        data.data?.tickets ??
        data.data ??
        [];

      setTickets(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        String(ticket.ticketNumber || "")
          .toLowerCase()
          .includes(query) ||
        String(ticket.subject || "")
          .toLowerCase()
          .includes(query) ||
        String(ticket.requesterEmail || ticket.email || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        ticket.status?.toLowerCase() === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        ticket.priority?.toLowerCase() === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const resolvedCount = tickets.filter((ticket) =>
    ["resolved", "closed"].includes(ticket.status?.toLowerCase())
  ).length;

  const openCount = tickets.filter((ticket) =>
    ["open", "reopened"].includes(ticket.status?.toLowerCase())
  ).length;

  const inProgressCount = tickets.filter((ticket) =>
    ["in progress", "in_progress", "pending"].includes(
      ticket.status?.toLowerCase()
    )
  ).length;

  const statusStyles = {
    open: "bg-blue-50 text-blue-700",
    reopened: "bg-orange-50 text-orange-700",
    pending: "bg-amber-50 text-amber-700",
    "in progress": "bg-violet-50 text-violet-700",
    in_progress: "bg-violet-50 text-violet-700",
    resolved: "bg-green-50 text-green-700",
    closed: "bg-slate-100 text-slate-600",
  };

  const priorityStyles = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-50 text-blue-700",
    high: "bg-orange-50 text-orange-700",
    urgent: "bg-red-50 text-red-700",
  };

  const stats = [
    {
      label: "Total Assigned",
      value: tickets.length,
      icon: Ticket,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Open",
      value: openCount,
      icon: Inbox,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      icon: Clock,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Resolved",
      value: resolvedCount,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Support Management
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Assigned Tickets
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Apne assigned customer tickets ko manage aur resolve karein.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAssignedTickets}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {loading ? "—" : item.value}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${item.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket, subject, email..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="in_progress">In Progress (underscore)</option>
              <option value="reopened">Reopened</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </section>

        {/* Tickets table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                My Ticket Queue
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading tickets..."
                  : `${filteredTickets.length} ticket(s) found`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading assigned tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox
                size={40}
                className="mx-auto text-slate-300"
              />
              <h3 className="mt-3 font-semibold text-slate-800">
                No tickets found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Search ya filters change karke dobara try karein.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
                className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Ticket ID</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-blue-600">
                        {ticket.ticketNumber || ticket._id?.slice(-6)}
                      </td>

                      <td className="max-w-[220px] truncate px-5 py-4 font-medium text-slate-800">
                        {ticket.subject || "Untitled ticket"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {ticket.requesterId?.name ||
                          ticket.requesterEmail ||
                          ticket.email ||
                          "Customer"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            priorityStyles[ticket.priority?.toLowerCase()] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ticket.priority || "Medium"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            statusStyles[ticket.status?.toLowerCase()] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ticket.status || "Open"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {ticket.createdAt
                          ? new Date(ticket.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/agent/tickets/${ticket._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
