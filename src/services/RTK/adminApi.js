
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),

  tagTypes: ["AdminTickets", "AdminUsers", "AdminAgents", "Categories"],

  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: (params) => ({
        url: "/tickets",
        params,
      }),
      providesTags: ["AdminTickets"],
    }),

    getUnassignedTickets: builder.query({
      query: () => "/tickets/unassigned",
      providesTags: ["AdminTickets"],
    }),

    getAdminDashboard: builder.query({
  query: () => "/admin/dashboard",
}),

    assignTicket: builder.mutation({
      query: ({ ticketId, agentId }) => ({
        url: `/tickets/${ticketId}/assign`,
        method: "PATCH",
        body: { agentId },
      }),
      invalidatesTags: ["AdminTickets"],
    }),

    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["AdminUsers"],
    }),

    getAllAgents: builder.query({
      query: () => "/users/agents",
      providesTags: ["AdminAgents"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, isActive }) => ({
        url: `/users/${userId}/status`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["AdminUsers", "AdminAgents"],
    }),

    getCategories: builder.query({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),

    createCategory: builder.mutation({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetAdminDashboardQuery,
  useGetUnassignedTicketsQuery,
  useAssignTicketMutation,
  useGetAllUsersQuery,
  useGetAllAgentsQuery,
  useUpdateUserStatusMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = adminApi;
