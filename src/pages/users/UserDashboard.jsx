
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyTicketsQuery } from "../../services/RTK/ticketApi";


// Temporary demo tickets
const dummyTickets = [
  {
    _id: "demo101",
    ticketNumber: "TKT-1001",
    subject: "Unable to login to my account",
    priority: "high",
    status: "open",
    createdAt: "2026-10-18T10:30:00.000Z",
    updatedAt: "2026-10-18T10:30:00.000Z",
  },
  {
    _id: "demo102",
    ticketNumber: "TKT-1002",
    subject: "Payment deducted but order not placed",
    priority: "urgent",
    status: "in_progress",
    createdAt: "2026-10-17T08:30:00.000Z",
    updatedAt: "2026-10-19T11:00:00.000Z",
  },
  {
    _id: "demo103",
    ticketNumber: "TKT-1003",
    subject: "Need help updating my profile",
    priority: "normal",
    status: "resolved",
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-10-16T12:00:00.000Z",
  },
  {
    _id: "demo104",
    ticketNumber: "TKT-1004",
    subject: "Email notification not working",
    priority: "medium",
    status: "pending",
    createdAt: "2026-10-14T07:30:00.000Z",
    updatedAt: "2026-10-14T07:30:00.000Z",
  },
];

const UserDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const {data} = useGetMyTicketsQuery();

   const fetchMyTickets = async () => {
      try {
        setLoading(true);

        const response = data;
        

        if (!response.ok) {
          throw new Error("Tickets could not be loaded.");
        }

        const result = await response;

        console.log(result,"result")

        // Supports common API response formats
        const ticketList =
          result.tickets ??
          result.data?.tickets ??
          result.data ??
          [];

        if (
          Array.isArray(ticketList) &&
          ticketList.length >= 0
        ) {
          // Real tickets available
          setTickets(ticketList);
          setUsingDemoData(false);
        } else {
          // Database has no tickets
          setTickets(dummyTickets);
          setUsingDemoData(true);
        }
      } catch (error) {
        console.error("Ticket API error:", error);

        // API failed: show temporary tickets
        setTickets(dummyTickets);
        setUsingDemoData(true);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
   

    fetchMyTickets();
  }, []);

  const getStatus = (status = "") => {
    const normalized = status
      .toLowerCase()
      .replaceAll("_", " ");

    if (
      normalized === "resolved" ||
      normalized === "closed"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "in progress") {
      return "bg-blue-100 text-blue-700";
    }

    if (
      normalized === "pending" ||
      normalized === "open"
    ) {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const openTickets = tickets.filter((ticket) =>
    ["open", "pending", "in progress", "in_progress"].includes(
      (ticket.status || "").toLowerCase()
    )
  ).length;

  const resolvedTickets = tickets.filter((ticket) =>
    ["resolved", "closed"].includes(
      (ticket.status || "").toLowerCase()
    )
  ).length;

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            My Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Track and manage your support tickets.
          </p>
        </div>

        <Link
          to="/user/create-ticket"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <span>＋</span>
          Create New Ticket
        </Link>
      </div>

      {/* Demo data notice */}
      {!loading && usingDemoData && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="font-semibold">
            Demo mode:
          </span>{" "}
          Showing temporary sample tickets because real ticket
          data is unavailable. These tickets are not saved in
          the database.
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading your tickets...
        </div>
      )}

      {!loading && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Tickets"
              value={tickets.length}
              icon="🎫"
              color="bg-blue-50 text-blue-700"
            />

            <SummaryCard
              title="Open Tickets"
              value={openTickets}
              icon="📂"
              color="bg-amber-50 text-amber-700"
            />

            <SummaryCard
              title="Resolved Tickets"
              value={resolvedTickets}
              icon="✅"
              color="bg-green-50 text-green-700"
            />

            <SummaryCard
              title="Recent Tickets"
              value={recentTickets.length}
              icon="🕒"
              color="bg-purple-50 text-purple-700"
            />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              to="/user/create-ticket"
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  ✍️
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-slate-800">
                    Need Help?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Create a support ticket for your issue.
                  </p>
                </div>

                <span className="text-slate-400 group-hover:text-blue-600">
                  →
                </span>
              </div>
            </Link>

            <Link
              to="/user/my-tickets"
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
                  💬
                </div>

                <div className="flex-1">
                  <h2 className="font-semibold text-slate-800">
                    My Conversations
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    View ticket replies and support updates.
                  </p>
                </div>

                <span className="text-slate-400 group-hover:text-blue-600">
                  →
                </span>
              </div>
            </Link>
          </div>

          {/* Recent tickets table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-800">
                  Recent Tickets
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest support requests
                </p>
              </div>

              <Link
                to="/user/my-tickets"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View All →
              </Link>
            </div>

            {recentTickets.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="text-4xl">🎫</div>

                <h3 className="mt-3 font-semibold text-slate-800">
                  No tickets yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first ticket to get support.
                </p>

                <Link
                  to="/user/create-ticket"
                  className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create Ticket
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        Ticket
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Subject
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Priority
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Created
                      </th>

                      <th className="px-5 py-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentTickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 font-medium text-blue-600">
                          {ticket.ticketNumber ||
                            ticket._id?.slice(-6) ||
                            "—"}
                        </td>

                        <td className="max-w-56 truncate px-5 py-4 font-medium text-slate-800">
                          {ticket.subject || "Untitled ticket"}
                        </td>

                        <td className="px-5 py-4 capitalize text-slate-600">
                          {ticket.priority || "Normal"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatus(
                              ticket.status
                            )}`}
                          >
                            {(ticket.status || "open").replaceAll(
                              "_",
                              " "
                            )}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                          {formatDate(ticket.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          {ticket._id?.startsWith("demo") ? (
                            <span className="text-xs text-slate-400">
                              Demo only
                            </span>
                          ) : (
                            <Link
                              to={`/user/tickets/${ticket._id}`}
                              className="font-semibold text-blue-600 hover:underline"
                            >
                              View
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${color}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold text-slate-800">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Based on your tickets
      </p>
    </div>
  );
};

export default UserDashboard;
