import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
 import requestLogger from "./middleware/requestLogger.js";
  import authRouters from "./routes/authRoutes.js"

dotenv.config();

const app = express();

app.use(express.json());

connectDB();
 app.use(requestLogger);
 

app.use("/api/tasks", taskRoutes);
app.use("/api/auth",authRouters);


// Error handler - ALWAYS LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});