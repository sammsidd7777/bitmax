
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: "🏠" },
    { name: "Create Ticket", path: "/user/create-ticket", icon: "➕" },
    { name: "My Tickets", path: "/user/my-tickets", icon: "🎫" },
    { name: "My Profile", path: "/user/profile", icon: "👤" },
  ];

  const handleLogout = () => {
    // Apne backend logout API ko yahan call karna.
    // Agar token localStorage mein rakhte ho:
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col
          bg-slate-900 text-white transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="border-b border-slate-700 px-6 py-5">
          <h1 className="text-xl font-bold tracking-wide">
            BitMax <span className="text-blue-400">Support</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Customer Support Portal
          </p>
        </div>

        <div className="px-5 py-5">
          <div className="rounded-xl bg-slate-800 p-4">
            <div className="flex h-10 w-10 items-center justify-center
              rounded-full bg-blue-600 text-lg font-bold">
              U
            </div>
            <p className="mt-3 font-semibold">User Panel</p>
            <p className="text-xs text-slate-400">Customer Account</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3">
          <p className="px-3 pb-2 text-xs font-semibold uppercase
            tracking-wider text-slate-500">
            Main Menu
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3
                text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left
              text-sm font-medium text-red-300 transition
              hover:bg-red-500/10 hover:text-red-200"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen md:ml-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center
          justify-between border-b border-slate-200 bg-white px-4
          shadow-sm sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <div>
              <h2 className="font-semibold text-slate-800">
                Customer Portal
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your support tickets
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/user/profile")}
            className="flex items-center gap-2 rounded-lg p-2
              hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center
              rounded-full bg-blue-100 font-semibold text-blue-700">
              U
            </div>
            <span className="hidden text-sm font-medium sm:block">
              My Account
            </span>
          </button>
        </header>

        {/* Child pages render here */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
