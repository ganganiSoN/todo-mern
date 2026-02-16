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

      if (isFind) {
        res.status(422).json({
          status: "Failed",
          message: "Duplicate Name Not Found",
        });
        return;
      }

      const documentReq = {
        name: document.name,
        todoId: new ObjectId(document.todoId),
        favourite: Boolean(document.favourite ?? false),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await getCollection().insertOne(documentReq);

      document._id = response.insertedId;

      req.io.emit("todoTask:created", document);

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
  } catch (error: any) {
    console.log(JSON.stringify(error.errInfo, null, 2));
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
});

router.put("/update", async (req, res) => {
  try {
    const document = req.body;
    const isFind = await getCollection().findOne({
      _id: new ObjectId(document._id),
    });

    if (!isFind) {
      return res.status(422).json({
        status: "Failed",
        message: "Record not Found",
      });
    }

    await getCollection().findOneAndUpdate(
      {
        _id: new ObjectId(document._id),
      },
      {
        $set: {
          name: document.name,
          updatedAt: new Date(),
        },
      },
    );

    req.io.emit("todoTask:updated", document);

    return res.status(200).json({
      status: "success",
      message: "Record updated",
      document,
    });
  } catch (error) {
    console.log(":: error", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
});

router.put("/favourite", async (req, res) => {
  try {
    const document = req.body;

    const isFind = await getCollection().findOne({
      _id: new ObjectId(document._id),
    });

    if (isFind) {
      console.log(":::: doc find");

      const response = await getCollection().findOneAndUpdate(
        { _id: new ObjectId(document._id) },
        {
          $set: {
            favourite: document.favourite,
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: "after",
        },
      );

      console.log("::: task update");

      req.io.emit("todoTask:updated", response);

      console.log("::: task update emit");

      return res.status(200).json({
        status: "success",
        message: "Record updated",
        response,
      });
    } else {
      return res.status(422).json({
        status: "Failed",
        message: "Record not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "Failed",
      message: "Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await getCollection().findOneAndDelete({ _id: new ObjectId(id) });

    req.io.emit("todoTask:deleted", { _id: id });

    return res.status(200).json({
      status: "success",
      message: "Remove Document",
    });
  } catch (error) {
    console.log(":: error", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
});

export default router;
