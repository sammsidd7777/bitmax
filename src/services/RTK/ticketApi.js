
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ticketApi = createApi({
  reducerPath: "ticketApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    credentials: "include",
  }),

  tagTypes: ["Tickets"],

  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: "/tickets",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["Tickets"],
    }),

    getMyTickets: builder.query({
      query: () => "/tickets/",
      method:"GET",
      providesTags: ["Tickets"],
    }),

    getTicketById: builder.query({
      query: (id) => `/tickets/${id}`,
      providesTags: ["Tickets"],
    }),

    assignTicket: builder.query({
        query:(id)=>`/tickets/:${id}/assign`
    })
  }),
});

export const {
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
} = ticketApi;
