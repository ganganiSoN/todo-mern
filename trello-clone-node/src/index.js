import express from "express";
import cors from "cors";
import userRouter from "./routes/auth.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", userRouter);

// app.configure(function () {
// app.use(app.bodyParser());
// });

// express.pa

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
