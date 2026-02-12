import express from "express";
import { getDb } from "../db/connection.ts";
import { ObjectId } from "mongodb";

const router = express.Router();

function getCollection() {
  const db = getDb();
  return db.collection("todo");
}

router.get("/", async (req, res) => {
  try {
    const records = await getCollection().find().toArray();

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

router.post("/create", async (req, res) => {
  try {
    const document = req.body;

    if (document.name.trim() !== "") {
      const isFind = await getCollection().findOne(document);

      if (isFind) {
        return res.status(422).json({
          status: "fail",
          message: "Duplicate Name Found.",
        });
      } else {
        const response = await getCollection().insertOne(document);

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
    const document = req.body;

    const isFind = await getCollection().findOne({
      _id: new ObjectId(document._id),
    });

    if (isFind) {
      const response = await getCollection().updateOne(
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
    const id = req.params.id;

    const response = getCollection().findOneAndDelete({
      _id: new ObjectId(id),
    });

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
