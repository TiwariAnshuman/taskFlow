
import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import api from "../../services/api";

function EditTaskModal({
  isOpen,
  task,
  onClose,
  onTaskUpdated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fill form when task changes
  useEffect(() => {
    if (!task) return;

    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "pending",
      priority: task.priority || "medium",
      dueDate: task.dueDate
        ? task.dueDate.split("T")[0]
        : "",
    });

    setError("");
  }, [task]);

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

      console.log("UPDATE TASK PAYLOAD:", payload);

      const response = await api.patch(
        `/tasks/${task._id}`,
        payload
      );

      console.log("UPDATE TASK RESPONSE:", response.data);

      // Tell Dashboard that update was successful
      onTaskUpdated?.(response.data);

      // Close modal
      onClose();
    } catch (error) {
      console.error(
        "UPDATE TASK ERROR:",
        error.response?.data || error.message
      );

      const backendError = error.response?.data;

      if (backendError?.errors?.length) {
        setError(
          backendError.errors
            .map((item) => item.msg)
            .join(", ")
        );
      } else {
        setError(
          backendError?.message ||
            "Failed to update task."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setError("");
    onClose();
  };

  if (!isOpen || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-xl border border-[#302D29] bg-[#191816] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#302D29] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#F5F5F4]">
              Edit Task
            </h2>

            <p className="mt-1 text-xs text-[#78716C]">
              Update the details of your task.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-[#78716C] transition-colors hover:bg-[#211F1C] hover:text-[#F5F5F4] disabled:cursor-not-allowed disabled:opacity-50"
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
              htmlFor="edit-title"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Title
            </label>

            <input
              id="edit-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              placeholder="Task title"
              className="w-full rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none transition placeholder:text-[#57534E] focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Description
            </label>

            <textarea
              id="edit-description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="What needs to be done?"
              className="w-full resize-none rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none transition placeholder:text-[#57534E] focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label
                htmlFor="edit-status"
                className="mb-2 block text-sm font-medium text-[#D6D3D1]"
              >
                Status
              </label>

              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-priority"
                className="mb-2 block text-sm font-medium text-[#D6D3D1]"
              >
                Priority
              </label>

              <select
                id="edit-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-[#302D29] bg-[#11100E] px-4 py-3 text-sm text-[#F5F5F4] outline-none focus:border-[#F59E0B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="edit-dueDate"
              className="mb-2 block text-sm font-medium text-[#D6D3D1]"
            >
              Due Date
            </label>

            <input
              id="edit-dueDate"
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
              className="rounded-lg border border-[#302D29] bg-[#211F1C] px-4 py-2.5 text-sm font-medium text-[#D6D3D1] transition-colors hover:bg-[#2A2723] hover:text-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-semibold text-[#11100E] transition-colors hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;