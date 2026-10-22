
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Ticket,
  Clock3,
  Tag,
  UserRound,
  CalendarDays,
  MessageCircle,
  Send,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Paperclip,
  ShieldCheck,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getValue = (obj, ...keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) {
      return obj[key];
    }
  }
  return "";
};

const getStatusClass = (status = "") => {
  const value = String(status).toLowerCase().replaceAll("_", " ");

  const styles = {
    open: "bg-blue-50 text-blue-700 ring-blue-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "in progress": "bg-violet-50 text-violet-700 ring-violet-200",
    resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    closed: "bg-gray-100 text-gray-600 ring-gray-200",
  };

  return styles[value] || "bg-gray-100 text-gray-700 ring-gray-200";
};

const getPriorityClass = (priority = "") => {
  const styles = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-sky-50 text-sky-700",
    high: "bg-orange-50 text-orange-700",
    urgent: "bg-red-50 text-red-700",
  };

  return styles[String(priority).toLowerCase()] || styles.medium;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function InfoCard({ icon: Icon, label, value, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            colors[color] || colors.indigo
          }`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className="mt-1 break-words text-sm font-semibold capitalize text-gray-800">
            {value || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TicketDetail() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadTicket = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load ticket.");
      }

      const ticketData =
        result.ticket ?? result.data?.ticket ?? result.data;

      if (!ticketData) {
        throw new Error("Ticket details were not found.");
      }

      setTicket(ticketData);

      const messageResponse = await fetch(
        `${API_URL}/tickets/${ticketId}/messages`,
        { credentials: "include" }
      );

      const messageResult = await messageResponse.json();

      if (!messageResponse.ok) {
        throw new Error(
          messageResult.message || "Unable to load conversation."
        );
      }

      const messageList =
        messageResult.messages ??
        messageResult.data?.messages ??
        messageResult.data ??
        [];

      setMessages(Array.isArray(messageList) ? messageList : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleSendReply = async (event) => {
    event.preventDefault();

    const text = reply.trim();

    if (!text || sending) return;

    try {
      setSending(true);
      setError("");

      const response = await fetch(
        `${API_URL}/tickets/${ticketId}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send reply.");
      }

      setReply("");
      await loadTicket(false);
    } catch (err) {
      setError(err.message || "Unable to send reply.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <LoaderCircle
            size={36}
            className="mx-auto animate-spin text-indigo-600"
          />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading ticket details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle size={28} />
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Unable to load ticket
        </h2>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <button
          onClick={() => loadTicket()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw size={17} />
          Try Again
        </button>

        <div>
          <Link
            to="/user/my-tickets"
            className="mt-5 inline-block text-sm font-medium text-indigo-600 hover:underline"
          >
            Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const status = getValue(ticket, "Status", "status") || "open";
  const priority = getValue(ticket, "Priority", "priority") || "medium";
  const subject = getValue(ticket, "Subject", "subject") || "Untitled ticket";
  const ticketNumber =
    getValue(ticket, "TicketNumber", "ticketNumber") ||
    `TKT-${String(ticket._id).slice(-6).toUpperCase()}`;

  const createdAt = getValue(ticket, "createdAt", "CreatedAt");
  const description =
    getValue(ticket, "Description", "description") || "No description provided.";

  const category = getValue(ticket, "Category", "category");
  const categoryName =
    typeof category === "object"
      ? getValue(category, "Name", "name")
      : category;

  const agent = getValue(
    ticket,
    "AssignedTo",
    "assignedTo",
    "AssignedAgent",
    "assignedAgent"
  );

  const agentName =
    typeof agent === "object"
      ? getValue(agent, "Name", "name", "FullName", "fullName", "Email", "email")
      : agent;

  const normalizedStatus = String(status).toLowerCase().replaceAll("_", " ");
  const isClosed = ["closed", "resolved"].includes(normalizedStatus);

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Breadcrumb */}
        <Link
          to="/user/my-tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to My Tickets
        </Link>

        {/* Ticket header */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-blue-400" />

          <div className="p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:h-14 sm:w-14">
                  <Ticket size={27} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {ticketNumber}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusClass(
                        status
                      )}`}
                    >
                      {normalizedStatus}
                    </span>
                  </div>

                  <h1 className="break-words text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    {subject}
                  </h1>

                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={16} />
                    Created {formatDate(createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => loadTicket(false)}
                disabled={refreshing}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {/* Details cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard
            icon={FlagIcon}
            label="Priority"
            value={priority}
            color="orange"
          />
          <InfoCard
            icon={Tag}
            label="Category"
            value={categoryName || "General"}
            color="indigo"
          />
          <InfoCard
            icon={UserRound}
            label="Assigned Agent"
            value={agentName || "Not assigned yet"}
            color="blue"
          />
        </div>

        {/* Description */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MessageCircle size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">Issue Description</h2>
              <p className="mt-0.5 text-xs text-gray-500">
                Original details provided with this ticket
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-4 sm:p-5">
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
              {description}
            </p>
          </div>
        </section>

        {/* Conversation */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <MessageCircle size={22} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Ticket Conversation
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Replies between you and the support team
                </p>
              </div>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>

          <div className="space-y-5 bg-gray-50/80 p-4 sm:p-7">
            {/* Original ticket as first message */}
            <div className="flex justify-end">
              <div className="max-w-[92%] sm:max-w-[78%]">
                <div className="mb-2 flex items-center justify-end gap-2 text-xs text-gray-500">
                  <span>You · Ticket created</span>
                </div>

                <div className="rounded-2xl rounded-tr-sm bg-indigo-600 p-4 text-white shadow-sm">
                  <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {description}
                  </p>

                  <p className="mt-3 text-right text-[11px] text-indigo-100">
                    {formatDate(createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-9 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                  <MessageCircle size={24} />
                </div>

                <h3 className="mt-3 text-sm font-semibold text-gray-800">
                  No replies yet
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                  Your conversation with the support team will appear here.
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const sender =
                  message.sender && typeof message.sender === "object"
                    ? message.sender
                    : {};

                const role = String(
                  getValue(
                    message,
                    "SenderRole",
                    "senderRole",
                    "Role",
                    "role"
                  ) ||
                    getValue(sender, "Role", "role", "UserRole", "userRole") ||
                    "support"
                ).toLowerCase();

                const isUser = ["user", "customer"].includes(role);

                const senderName =
                  getValue(
                    message,
                    "SenderName",
                    "senderName",
                    "Name",
                    "name"
                  ) ||
                  getValue(sender, "Name", "name", "Email", "email") ||
                  (isUser ? "You" : "Support Team");

                const messageText =
                  getValue(message, "Text", "text", "Body", "body", "Content", "content");

                const messageDate = getValue(
                  message,
                  "createdAt",
                  "CreatedAt"
                );

                return (
                  <div
                    key={message._id || `${messageDate}-${index}`}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[92%] sm:max-w-[78%]">
                      <div
                        className={`mb-2 flex items-center gap-2 text-xs text-gray-500 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isUser && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                            <ShieldCheck size={14} />
                          </span>
                        )}

                        <span className="font-semibold">{senderName}</span>
                        <span>·</span>
                        <span>{formatDate(messageDate)}</span>
                      </div>

                      <div
                        className={`rounded-2xl p-4 shadow-sm ${
                          isUser
                            ? "rounded-tr-sm bg-indigo-600 text-white"
                            : "rounded-tl-sm border border-gray-200 bg-white text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                          {messageText || "No message content"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply composer */}
          <div className="border-t border-gray-200 bg-white p-4 sm:p-7">
       

            {isClosed ? (
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Ticket {normalizedStatus}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    Replies are disabled for this ticket. Contact support if
                    you need further assistance.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendReply}>
                <label
                  htmlFor="ticket-reply"
                  className="mb-3 block text-sm font-bold text-gray-800"
                >
                  Write a reply
                </label>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10">
                  <textarea
                    id="ticket-reply"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    rows={4}
                    maxLength={5000}
                    placeholder="Type your message here..."
                    className="w-full resize-y bg-transparent px-2 py-1 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400"
                  />

                  <div className="mt-2 flex flex-col justify-between gap-3 border-t border-gray-200 pt-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Paperclip size={15} />
                      <span>Keep your message clear and concise.</span>
                      <span>{reply.length}/5000</span>
                    </div>

                    <button
                      type="submit"
                      disabled={!reply.trim() || sending}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <LoaderCircle size={17} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>

        <div className="pb-4 text-center text-xs text-gray-400">
          <Clock3 size={13} className="mr-1 inline" />
          Ticket updates appear when you refresh the conversation.
        </div>
      </div>
    </div>
  );
}

function FlagIcon({ size = 19 }) {
  return <Tag size={size} />;
}
