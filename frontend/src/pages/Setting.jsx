import {
  User,
  Mail,
  Shield,
  LogOut,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#11100E] text-[#F5F5F4]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Topbar */}
        <Topbar />

        <main className="flex-1 overflow-auto p-6">

          {/* Page Heading */}
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F59E0B]">
              Preferences
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              Settings
            </h1>

            <p className="mt-1 text-sm text-[#78716C]">
              Manage your account and security preferences.
            </p>
          </div>

          <div className="max-w-3xl space-y-6">

            {/* Account */}
            <section className="overflow-hidden rounded-lg border border-[#302D29] bg-[#191816]">

              <div className="border-b border-[#302D29] px-5 py-4">
                <div className="flex items-center gap-3">
                  <User
                    size={18}
                    className="text-[#F59E0B]"
                  />

                  <div>
                    <h2 className="text-sm font-semibold">
                      Account
                    </h2>

                    <p className="mt-0.5 text-xs text-[#78716C]">
                      Your TaskFlow account information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#302D29]">

                {/* Name */}
                <div className="flex items-center justify-between gap-6 px-5 py-4">
                  <div>
                    <p className="text-xs text-[#78716C]">
                      Name
                    </p>

                    <p className="mt-1 text-sm text-[#F5F5F4]">
                      {user?.name || "—"}
                    </p>
                  </div>

                  <User
                    size={17}
                    className="text-[#57534E]"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between gap-6 px-5 py-4">
                  <div>
                    <p className="text-xs text-[#78716C]">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-[#F5F5F4]">
                      {user?.email || "—"}
                    </p>
                  </div>

                  <Mail
                    size={17}
                    className="text-[#57534E]"
                  />
                </div>

                {/* User ID */}
                <div className="flex items-center justify-between gap-6 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-xs text-[#78716C]">
                      User ID
                    </p>

                    <p className="mt-1 truncate text-xs text-[#A8A29E]">
                      {user?._id || "—"}
                    </p>
                  </div>

                  <Shield
                    size={17}
                    className="shrink-0 text-[#57534E]"
                  />
                </div>

              </div>
            </section>

            {/* Security */}
            <section className="overflow-hidden rounded-lg border border-[#302D29] bg-[#191816]">

              <div className="border-b border-[#302D29] px-5 py-4">
                <div className="flex items-center gap-3">
                  <Shield
                    size={18}
                    className="text-[#F59E0B]"
                  />

                  <div>
                    <h2 className="text-sm font-semibold">
                      Security
                    </h2>

                    <p className="mt-0.5 text-xs text-[#78716C]">
                      Manage your active session.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-4">

                <div>
                  <p className="text-sm text-[#F5F5F4]">
                    Sign out
                  </p>

                  <p className="mt-1 text-xs text-[#78716C]">
                    Sign out of your TaskFlow account on this device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#302D29] px-3.5 py-2 text-sm text-[#A8A29E] transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            </section>

            {/* Danger Zone */}
            <section className="overflow-hidden rounded-lg border border-red-500/20 bg-[#191816]">

              <div className="border-b border-red-500/20 px-5 py-4">
                <h2 className="text-sm font-semibold text-red-400">
                  Danger Zone
                </h2>

                <p className="mt-0.5 text-xs text-[#78716C]">
                  Destructive account actions.
                </p>
              </div>

              <div className="px-5 py-4">
                <div>
                  <p className="text-sm text-[#F5F5F4]">
                    Delete account
                  </p>

                  <p className="mt-1 text-xs text-[#78716C]">
                    Account deletion will be added after the backend
                    endpoint is implemented.
                  </p>
                </div>
              </div>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;