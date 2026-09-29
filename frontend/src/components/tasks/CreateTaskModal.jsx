import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "../../services/api";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, Input, Textarea, Select, dateInputClass } from "../ui/Input";
import { Alert } from "../ui/Feedback";

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
    <Modal
      title="Create task"
      description="Add a new task to your workspace."
      onClose={handleClose}
      closeDisabled={loading}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="create-task-form"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </>
      }
    >
      {error && <Alert className="mb-5">{error}</Alert>}

      <form
        id="create-task-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Title */}
        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Complete backend integration"
            disabled={loading}
          />
        </Field>

        {/* Description */}
        <Field label="Description" htmlFor="description">
          <Textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="What needs to be done?"
            disabled={loading}
          />
        </Field>

        {/* Status + Priority */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status" htmlFor="status">
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </Field>

          <Field label="Priority" htmlFor="priority">
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </Field>
        </div>

        {/* Due Date */}
        <Field label="Due date" htmlFor="dueDate">
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={loading}
            className={dateInputClass}
          />
        </Field>
      </form>
    </Modal>
  );
}

export default CreateTaskModal;