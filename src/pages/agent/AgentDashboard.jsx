
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Inbox,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAgentTickets();
  }, []);

  const fetchAgentTickets = async () => {
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
        throw new Error(data.message || "Tickets load nahi hue");
      }

      const ticketList =
        data.tickets ||
        data.data?.tickets ||
        data.data ||
        [];

      setTickets(Array.isArray(ticketList) ? ticketList : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isResolved = (ticket) =>
    ["resolved", "closed"].includes(
      ticket.status?.toLowerCase()
    );

  const isOpen = (ticket) =>
    ["open", "reopened"].includes(
      ticket.status?.toLowerCase()
    );

  const isInProgress = (ticket) =>
    ["in progress", "in_progress", "pending"].includes(
      ticket.status?.toLowerCase()
    );

  const stats = [
    {
      title: "My Assigned Tickets",
      value: tickets.length,
      icon: Ticket,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Open Tickets",
      value: tickets.filter(isOpen).length,
      icon: Inbox,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "In Progress",
      value: tickets.filter(isInProgress).length,
      icon: Clock,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Resolved Tickets",
      value: tickets.filter(isResolved).length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
  ];

  const priorityClass = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const statusClass = {
    open: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    "in progress": "bg-violet-100 text-violet-700",
    in_progress: "bg-violet-100 text-violet-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-slate-100 text-slate-600",
    reopened: "bg-orange-100 text-orange-700",
  };

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Support Agent Panel
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Agent Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Apne tickets aur support requests ko yahan manage karein.
            </p>
          </div>

          <button
            onClick={fetchAgentTickets}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
            <button
              onClick={fetchAgentTickets}
              className="ml-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                      {loading ? "—" : stat.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Priority summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Priority Overview
              </h2>
              <p className="text-sm text-slate-500">
                Tickets ko priority ke according dekhein.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["urgent", "high", "medium", "low"].map((priority) => (
              <div
                key={priority}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    priorityClass[priority]
                  }`}
                >
                  {priority}
                </span>

                <p className="mt-3 text-2xl font-bold text-slate-900">
                  {loading
                    ? "—"
                    : tickets.filter(
                        (ticket) =>
                          ticket.priority?.toLowerCase() === priority
                      ).length}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Tickets
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent tickets */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Recent Assigned Tickets
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Recently updated support requests.
              </p>
            </div>

            <Link
              to="/agent/my-tickets"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading tickets...
            </div>
          ) : recentTickets.length === 0 ? (
            <div className="p-10 text-center">
              <Inbox
                size={36}
                className="mx-auto text-slate-300"
              />
              <h3 className="mt-3 font-semibold text-slate-800">
                No assigned tickets
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Jab tickets assign honge, woh yahan dikhai denge.
              </p>
              <Link
                to="/agent/unassigned"
                className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                View Unassigned Tickets
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Ticket</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Updated</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentTickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {ticket.ticketNumber || ticket._id?.slice(-6)}
                      </td>

                      <td className="max-w-xs truncate px-6 py-4 font-medium text-slate-800">
                        {ticket.subject}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            priorityClass[ticket.priority?.toLowerCase()] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ticket.priority || "Medium"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            statusClass[ticket.status?.toLowerCase()] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {ticket.status || "Open"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                        {ticket.updatedAt || ticket.createdAt
                          ? new Date(
                              ticket.updatedAt || ticket.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          to={`/agent/tickets/${ticket._id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick links */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/agent/my-tickets"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <div>
              <h3 className="font-bold text-slate-900">
                My Assigned Tickets
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Reply to customers and update ticket status.
              </p>
            </div>
            <ArrowRight
              size={20}
              className="text-slate-400 group-hover:text-blue-600"
            />
          </Link>

          <Link
            to="/agent/unassigned"
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
          >
            <div>
              <h3 className="font-bold text-slate-900">
                Unassigned Tickets
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                View tickets awaiting assignment.
              </p>
            </div>
            <ArrowRight
              size={20}
              className="text-slate-400 group-hover:text-blue-600"
            />
          </Link>
        </section>
      </div>
    </div>
  );
}
