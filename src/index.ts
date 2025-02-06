import express from "express";
import { config as configDotenv } from "dotenv";
import ConnectDB from "./config/DBConnection"
import cookieParser from "cookie-parser";
import userRouter from "./routes/UserRoutes";
import taskRouter from "./routes/TaskRoutes";
import cors from "cors";




configDotenv();
ConnectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: '*', 
  credentials: true
}));



app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});