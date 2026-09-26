import Task from "../models/Task.js";

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
      //logged-in user's id
      user: req.user.userId,

    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const { status,
      priority,
      search,
      page = 1,
      limit = 5,
      sort = "createAt",
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
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use pending, in-progress, or completed",
      });
    }

    // Validate priority
    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid priority. Use low, medium, or high",
      });
    }
    //pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "page and limit must be grater than 0",

      });
    }
    const skip = (pageNumber - 1) * limitNumber;

    // sort 
    const allowedsortfields = [
      "createdAt",
      "updateAt",
      "dueDate",
      "title",

    ];
    if (!allowedsortfields.includes(sort)) {
      return res.status(400).json({
        success: false,
        message: "invalid sort field . use createdAt, updatedAt ,dueDate, or title",

      });

    }
    if (!["asc", "desc"].includes(sortOrder)) {
      return res.status(400).json({
        success: false,
        message: "invalid sort order . use asc or desc ",

      });

    }


    // Build MongoDB filter
    const filter = {
      user:req.user.userId,

    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },

      ];
    }
    // total matching tasks
    const totalTasks = await Task.countDocuments(filter);
    // get paginated tasks


    const sortValue = sortOrder === "asc" ? 1 : -1;

    const tasks = await Task.find(filter)
      .sort({ [sort]: sortValue })
      .skip(skip)
      .limit(limitNumber);


    res.status(200).json({
      success: true,
      page: pageNumber,
      limit: limitNumber,
      totalTasks,

      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id:id,
      user:req.user.userId,

    });


    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
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
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete({
      _id:id,
      user:req.user.userId,
      
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
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