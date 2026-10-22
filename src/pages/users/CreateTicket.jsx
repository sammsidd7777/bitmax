
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Ticket,
  Send,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  FileText,
  Tag,
  Flag,
} from "lucide-react";
import { useCreateTicketMutation } from "../../services/RTK/ticketApi";


const CreateTicket = () => {
  const navigate = useNavigate();
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      category: "",
      priority: "medium",
      description: "",
    },
  });

  const description = watch("description") || "";

  const onSubmit = async (data) => {
    setApiError("");

    try {
      const result = await createTicket({
        Subject: data.subject.trim(),
        Category: data.category,
        Priority: data.priority,
        Description: data.description.trim(),
      }).unwrap();

      const ticket =
        result?.ticket ??
        result?.data?.ticket ??
        result?.data;

      if (!ticket?._id) {
        setApiError(
          "Ticket create ho gaya ho sakta hai, lekin response mein ticket ID nahi mili."
        );
        return;
      }

      reset();

      // Ticket detail page par redirect
      navigate(`/user/tickets/${ticket._id}`);
    } catch (error) {
      setApiError(
        error?.data?.message ||
          error?.message ||
          "Ticket create nahi ho paya. Please try again."
      );
    }
  };

  const inputClass = (fieldError) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${
      fieldError
        ? "border-red-400"
        : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back navigation */}
        <Link
          to="/user/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Ticket size={28} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Create a Support Ticket
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Describe the issue you are facing. Our support team will review
            your request and help you resolve it.
          </p>
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
            <h2 className="font-semibold text-gray-900">
              Ticket Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fields marked with * are required.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-5 sm:p-8"
          >
            {/* API error */}
            {apiError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <p>{apiError}</p>
              </div>
            )}

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
              >
                <FileText size={17} className="text-indigo-500" />
                Subject <span className="text-red-500">*</span>
              </label>

              <input
                id="subject"
                type="text"
                maxLength={150}
                placeholder="Briefly describe your issue"
                className={inputClass(errors.subject)}
                {...register("subject", {
                  required: "Subject is required.",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Subject cannot be empty.",
                  maxLength: {
                    value: 150,
                    message: "Subject cannot exceed 150 characters.",
                  },
                })}
              />

              {errors.subject && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Category and priority */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
                >
                  <Tag size={17} className="text-indigo-500" />
                  Category <span className="text-red-500">*</span>
                </label>
{/* 
                <select
                  id="category"
                  className={inputClass(errors.category)}
                  {...register("category", {
                    required: "Please select a category.",
                  })}
                >
                  <option value="">Select category</option>
                  <option value="support">Technical Issue</option>
                  <option value="general">Account & Login</option>
                  <option value="it">Billing & Payment</option>
                  <option value="general">General Inquiry</option>
                  <option value="other">Other</option>
                </select> */}

                {errors.category && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800"
                >
                  <Flag size={17} className="text-indigo-500" />
                  Priority <span className="text-red-500">*</span>
                </label>

                <select
                  id="priority"
                  className={inputClass(errors.priority)}
                  {...register("priority", {
                    required: "Please select a priority.",
                    validate: (value) =>
                      ["low", "medium", "high", "urgent"].includes(
                        value
                      ) || "Please select a valid priority.",
                  })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                {errors.priority && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Description <span className="text-red-500">*</span>
              </label>

              <textarea
                id="description"
                rows={6}
                maxLength={5000}
                placeholder="Explain the issue, what happened, and what you have already tried..."
                className={`${inputClass(
                  errors.description
                )} min-h-36 resize-y`}
                {...register("description", {
                  required: "Description is required.",
                  validate: (value) =>
                    value.trim().length >= 10 ||
                    "Description must contain at least 10 non-space characters.",
                  maxLength: {
                    value: 5000,
                    message: "Description cannot exceed 5000 characters.",
                  },
                })}
              />

              <div className="mt-2 flex items-start justify-between gap-3">
                {errors.description ? (
                  <p className="text-xs text-red-600">
                    {errors.description.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Provide enough detail to help us understand the issue.
                  </p>
                )}

                <span className="shrink-0 text-xs text-gray-400">
                  {description.length}/5000
                </span>
              </div>
            </div>

            {/* Information note */}
            <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  What happens next?
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Your ticket will be saved and the support team can review
                  and respond to it. You can track updates in My Tickets.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                to="/user/my-tickets"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Creating Ticket...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
