
import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "../services/RTK/authApi";
import { userApi } from "../services/RTK/userApi";
import { agentApi } from "../services/RTK/agentApi";
import { adminApi } from "../services/RTK/adminApi";
import { ticketApi } from "../services/RTK/ticketApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [ticketApi.reducerPath]:ticketApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(agentApi.middleware)
      .concat(adminApi.middleware)
      .concat(ticketApi.middleware),
});
