import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#11100E] text-[#F5F5F4] flex">

      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 overflow-auto">

          {/* Page heading */}
          <div className="mb-6">
            <p className="text-sm text-[#A8A29E]">
              Stay focused and keep moving.
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              Good to see you.
            </h2>
          </div>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

            <div className="border border-[#302D29] bg-[#191816] rounded-lg p-5">
              <p className="text-sm text-[#A8A29E]">
                Total Tasks
              </p>

              <p className="text-3xl font-semibold mt-2">
                0
              </p>
            </div>

            <div className="border border-[#302D29] bg-[#191816] rounded-lg p-5">
              <p className="text-sm text-[#A8A29E]">
                Completed
              </p>

              <p className="text-3xl font-semibold mt-2">
                0
              </p>
            </div>

            <div className="border border-[#302D29] bg-[#191816] rounded-lg p-5">
              <p className="text-sm text-[#A8A29E]">
                Overdue
              </p>

              <p className="text-3xl font-semibold mt-2">
                0
              </p>
            </div>

          </section>

          {/* Tasks */}
          <section>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Tasks
                </h3>

                <p className="text-sm text-[#A8A29E] mt-1">
                  Manage your current work.
                </p>
              </div>

              <button className="text-sm text-[#F59E0B] hover:text-[#D97706]">
                View all
              </button>
            </div>

            {/* Empty state */}
            <div className="border border-dashed border-[#302D29] rounded-lg bg-[#191816] min-h-56 flex items-center justify-center">
              <div className="text-center">

                <div className="w-10 h-10 mx-auto mb-3 border border-[#302D29] rounded-lg flex items-center justify-center">
                  <span className="text-[#F59E0B]">+</span>
                </div>

                <h4 className="font-medium">
                  No tasks yet
                </h4>

                <p className="text-sm text-[#A8A29E] mt-1">
                  Create your first task to get started.
                </p>

                <button className="mt-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#11100E] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Create Task
                </button>

              </div>
            </div>

          </section>

        </main>
      </div>

    </div>
  );
}

export default Dashboard;