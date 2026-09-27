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

    // Validate status
    if (status && !allowedStatuses.includes(status)) {
      return sendError(
        res,
        400,
        "Invalid status. Use pending, in-progress, or completed"
      );
    }

    // Validate priority
    if (priority && !allowedPriorities.includes(priority)) {
      return sendError(
        res,
        400,
        "Invalid priority. Use low, medium, or high"
      );
    }

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      return sendError(
        res,
        400,
        "Page and limit must be greater than 0"
      );
    }

    const skip = (pageNumber - 1) * limitNumber;

    // Sort
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

    // Build MongoDB filter
    const filter = {
      user: req.user.userId,
    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

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

    // Total matching tasks
    const totalTasks = await Task.countDocuments(filter);

    // Sort
    const sortValue = sortOrder === "asc" ? 1 : -1;

    // Get paginated tasks
    const tasks = await Task.find(filter)
      .sort({ [sort]: sortValue })
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

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      user: req.user.userId,
    });

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
    );

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
  getTaskById,
  updateTask,
  deleteTask,
};