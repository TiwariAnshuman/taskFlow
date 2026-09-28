import { useState } from "react";
import { Loader2, X } from "lucide-react";
import api from "../../services/api";

function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
      };

      console.log("CREATE TASK PAYLOAD:", payload);

      const response = await api.post("/tasks", payload);

      console.log("CREATE TASK RESPONSE:", response.data);

      // Send newly created task back to Dashboard
      onTaskCreated?.(response.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
      });

      onClose();
    } catch (error) {
      console.error(
        "CREATE TASK ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setError("");

    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
    });

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      <div className="w-full max-w-lg rounded-xl border border-[#302D29] bg-[#191816] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#302D29] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#F5F5F4]">
              Create Task
            </h2>

            <p className="mt-1 text-xs text-[#78716C]">
              Add a new task to your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-[#78716C] transition hover:bg-[#211F1C] hover:text-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-5 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete backend integration"
              disabled={loading}
              className="w-full rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none transition placeholder:text-[#57534E] focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="What needs to be done?"
              disabled={loading}
              className="w-full resize-none rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none transition placeholder:text-[#57534E] focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-[#D6D3D1]"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="mb-2 block text-sm font-medium text-[#D6D3D1]"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#302D29] pt-5">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-[#302D29] bg-[#211F1C] px-4 py-2.5 text-sm font-medium text-[#D6D3D1] transition hover:bg-[#2A2723] hover:text-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-semibold text-[#11100E] transition hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;