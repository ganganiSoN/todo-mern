import express from "express";
import { getDb } from "../db/connection.ts";
import { ObjectId } from "mongodb";

const router = express.Router();
// const db = getDb();
// const collection = db.collection("tasks");

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("tasks");
    const records = await collection.find().toArray();

    return res.status(200).json({
      status: "success",
      data: records,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/add-new", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("tasks");
    const document = req.body;

    if (document.name.trim() !== "") {
      const isFind = await collection.findOne(document);

      if (isFind) {
        return res.status(422).json({
          status: "fail",
          message: "Duplicate Name Found.",
        });
      } else {
        const response = await collection.insertOne(document);

        document._id = response.insertedId;

        req.io.emit("addNewToDo", document);

        return res.status(200).json({
          status: "success",
          message: "Name Added",
          response,
        });
      }
    } else {
      return res.status(422).json({
        status: "fail",
        message: "Name can not empty",
      });
    }
  } catch (error) {}
});

router.put("/update", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("tasks");
    const document = req.body;

    const isFind = await collection.findOne({
      _id: new ObjectId(document._id),
    });

    if (isFind) {
      const response = await collection.updateOne(
        { _id: new ObjectId(document._id) },
        { $set: { name: document.name } },
      );

      req.io.emit("updateToDo", document);

      return res.status(200).json({
        status: "success",
        message: "update",
        response,
      });
    } else {
      res.status(422).json({
        status: "fail",
        message: "Not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("tasks");
    const id = req.params.id;

    const response = collection.findOneAndDelete({ _id: new ObjectId(id) });

    console.log(":: response", response);

    req.io.emit("deleteToDo", { _id: id });

    res.status(200).json({ status: "success", message: "Successfully delete" });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
    });
  }
});

export default router;
