import Task from "../models/Task.js";
import { sendSuccess, sendError } from "../utils/response.js";

const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      // logged-in user's id
      user: req.user.userId,
    });

    await task.populate("user", "name email");

    return sendSuccess(
      res,
      201,
      "Task created successfully",
      task
    );
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      dueDate,
      dueDateFilter,
      search,
      page = 1,
      limit = 5,
      sort = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const allowedStatuses = [
      "pending",
      "in-progress",
      "completed",
    ];

    const allowedPriorities = [
      "low",
      "medium",
      "high",
    ];

    const allowedDueDateFilters = [
      "today",
      "upcoming",
      "overdue",
      "no-date",
    ];

    // -----------------------------
    // Validate status
    // -----------------------------
    if (status) {
      const requestedStatuses = status.split(",");

      const invalidStatus = requestedStatuses.some(
        (item) => !allowedStatuses.includes(item)
      );

      if (invalidStatus) {
        return sendError(
          res,
          400,
          "Invalid status. Use pending, in-progress, or completed"
        );
      }
    }

    // -----------------------------
    // Validate priority
    // -----------------------------
    if (
      priority &&
      !allowedPriorities.includes(priority)
    ) {
      return sendError(
        res,
        400,
        "Invalid priority. Use low, medium, or high"
      );
    }

    // -----------------------------
    // Validate due date filter
    // -----------------------------
    if (
      dueDateFilter &&
      !allowedDueDateFilters.includes(dueDateFilter)
    ) {
      return sendError(
        res,
        400,
        "Invalid dueDateFilter. Use today, upcoming, overdue, or no-date"
      );
    }

    // -----------------------------
    // Pagination
    // -----------------------------
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return sendError(
        res,
        400,
        "Page and limit must be greater than 0"
      );
    }

    const skip = (pageNumber - 1) * limitNumber;

    // -----------------------------
    // Sort validation
    // -----------------------------
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "title",
    ];

    if (!allowedSortFields.includes(sort)) {
      return sendError(
        res,
        400,
        "Invalid sort field. Use createdAt, updatedAt, dueDate, or title"
      );
    }

    if (!["asc", "desc"].includes(sortOrder)) {
      return sendError(
        res,
        400,
        "Invalid sort order. Use asc or desc"
      );
    }

    // -----------------------------
    // Build MongoDB filter
    // -----------------------------
    const filter = {
      user: req.user.userId,
    };

    // Status filter
    if (status) {
      const requestedStatuses = status.split(",");

      filter.status = {
        $in: requestedStatuses,
      };
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Exact due date filter
    if (dueDate) {
      const startOfDay = new Date(dueDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(dueDate);
      endOfDay.setHours(23, 59, 59, 999);

      filter.dueDate = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // -----------------------------
    // Due date filters
    // -----------------------------
    const now = new Date();

    // Today
    if (dueDateFilter === "today") {
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);

      filter.dueDate = {
        $gte: startOfToday,
        $lte: endOfToday,
      };
    }

    // Upcoming
    if (dueDateFilter === "upcoming") {
      const startOfTomorrow = new Date(now);

      startOfTomorrow.setDate(
        startOfTomorrow.getDate() + 1
      );

      startOfTomorrow.setHours(0, 0, 0, 0);

      filter.dueDate = {
        $gte: startOfTomorrow,
      };

      // Completed tasks are not considered upcoming
      filter.status = {
        $ne: "completed",
      };
    }

    // Overdue
    if (dueDateFilter === "overdue") {
      filter.dueDate = {
        $lt: now,
      };

      // Completed tasks are not considered overdue
      filter.status = {
        $ne: "completed",
      };
    }

    // No due date
    if (dueDateFilter === "no-date") {
      filter.dueDate = null;
    }

    // -----------------------------
    // Search
    // -----------------------------
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -----------------------------
    // Total matching tasks
    // -----------------------------
    const totalTasks = await Task.countDocuments(filter);

    // -----------------------------
    // Sort
    // -----------------------------
    const sortValue =
      sortOrder === "asc" ? 1 : -1;

    // -----------------------------
    // Get paginated tasks
    // -----------------------------
    const tasks = await Task.find(filter)
      .populate("user", "name email")
      .sort({
        [sort]: sortValue,
      })
      .skip(skip)
      .limit(limitNumber);

    return sendSuccess(
      res,
      200,
      "Tasks fetched successfully",
      {
        page: pageNumber,
        limit: limitNumber,
        totalTasks,
        count: tasks.length,
        tasks,
      }
    );
  } catch (error) {
    next(error);
  }
};
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const now = new Date();

    const [
      total,
      completed,
      pending,
      inProgress,
      overdue,
    ] = await Promise.all([
      Task.countDocuments({
        user: userId,
      }),

      Task.countDocuments({
        user: userId,
        status: "completed",
      }),

      Task.countDocuments({
        user: userId,
        status: "pending",
      }),

      Task.countDocuments({
        user: userId,
        status: "in-progress",
      }),

      Task.countDocuments({
        user: userId,
        dueDate: {
          $lt: now,
        },
        status: {
          $ne: "completed",
        },
      }),
    ]);

    return sendSuccess(
      res,
      200,
      "Task stats fetched successfully",
      {
        total,
        completed,
        pending,
        inProgress,
        overdue,
      }
    );
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      user: req.user.userId,
    }).populate("user", "name email");

    if (!task) {
      return sendError(
        res,
        404,
        "Task not found"
      );
    }

    return sendSuccess(
      res,
      200,
      "Task fetched successfully",
      task
    );
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateData = {};

    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
    }

    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }

    if (req.body.priority !== undefined) {
      updateData.priority = req.body.priority;
    }

    if (req.body.dueDate !== undefined) {
      updateData.dueDate = req.body.dueDate;
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        user: req.user.userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    if (!task) {
      return sendError(
        res,
        404,
        "Task not found"
      );
    }

    return sendSuccess(
      res,
      200,
      "Task updated successfully",
      task
    );
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!deletedTask) {
      return sendError(
        res,
        404,
        "Task not found"
      );
    }

    return sendSuccess(
      res,
      200,
      "Task deleted successfully",
      deletedTask
    );
  } catch (error) {
    next(error);
  }
};

export default {
  createTask,
  getAllTasks,
  getTaskStats,
  getTaskById,
  updateTask,
  deleteTask,
};