import express from "express";
import { getDb } from "../db/connection.ts";
import { compare, hash } from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("users");

    let newDocument = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const isFind = await collection.findOne({ email: newDocument.email });

    if (isFind) {
      return res.status(422).json({
        status: "fail",
        message: {
          email: "Email Already Exist",
        },
      });
    } else {
      newDocument.password = await hash(newDocument.password, 10);
      const result = await collection.insertOne(newDocument);

      return res.status(200).json({
        status: "success",
        data: result,
      });
    }
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Error adding record");
  }
});

router.post("/login", async (req, res) => {
  try {
    const db = getDb();
    const collection = db.collection("users");
    const { email, password } = req.body;

    const user = await collection.findOne({ email });

    console.log(":: user", user);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: {
          commonMessage: "Invalid Credential",
        },
      });
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: {
          commonMessage: "Invalid Credential",
        },
      });
    }

    return res.status(200).json({
      status: "ok",
      message: {
        commonMessage: "Login Success",
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
