
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const agentApi = createApi({
  reducerPath: "agentApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),

  tagTypes: ["AgentTickets", "Ticket"],

  endpoints: (builder) => ({
    getAssignedTickets: builder.query({
      query: (params) => ({
        url: "/tickets/assigned",
        params,
      }),
      providesTags: ["AgentTickets"],
    }),

    getAgentUnassignedTickets: builder.query({
      query: () => "/tickets/unassigned",
      providesTags: ["AgentTickets"],
    }),

    assignTicketToSelf: builder.mutation({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}/assign-self`,
        method: "PATCH",
      }),
      invalidatesTags: ["AgentTickets"],
    }),

    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status }) => ({
        url: `/tickets/${ticketId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AgentTickets", "Ticket"],
    }),

    replyToTicket: builder.mutation({
      query: ({ ticketId, ...body }) => ({
        url: `/tickets/${ticketId}/messages`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AgentTickets", "Ticket"],
    }),
  }),
});

export const {
  useGetAssignedTicketsQuery,
  useGetAgentUnassignedTicketsQuery,
  useAssignTicketToSelfMutation,
  useUpdateTicketStatusMutation,
  useReplyToTicketMutation,
} = agentApi;
