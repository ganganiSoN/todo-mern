import express from "express";
import { getDb } from "../db/connection.ts";
import { Collection, ObjectId } from "mongodb";

export interface ITodoTask {
  _id?: ObjectId;
  name: string;
  todoId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const router = express.Router();

function getCollection(): Collection<ITodoTask> {
  const db = getDb();
  return db.collection("todo-task");
}

router.get("/", async (req, res) => {
  try {
    const { id } = req.query;
    console.log(":: id", id);
    const records = await getCollection()
      .find({ todoId: new ObjectId(id as string) })
      .toArray();

    return res.status(200).json({
      status: "success",
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Server Error",
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const document = req.body;

    if (document.name.trim() !== "") {
      console.log(":::: document name if");
      const isFind = await getCollection().findOne({ name: document.name });

      console.log(":::: is find");

      if (isFind) {
        res.status(422).json({
          status: "Failed",
          message: "Duplicate Nae Not Found",
        });
        return;
      }

      const documentReq = {
        name: document.name,
        todoId: new ObjectId(document.todoId),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await getCollection().insertOne(documentReq);

      document._id = response.insertedId;

      req.io.emit("addNewToDoTask", document);

      return res.status(200).json({
        status: "Success",
        message: "Task Created",
        response,
      });
    } else {
      res.status(422).json({
        status: "fail",
        message: "Name Can not be empty",
      });
    }
  } catch (error) {
    console.log(":: error", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
});

router.put("/update", async (req, res) => {
  try {
  } catch (error) {
    console.log(":: error", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
});

router.delete("/delete", async (req, res) => {
  try {
  } catch (error) {
    console.log(":: error", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
});

export default router;
