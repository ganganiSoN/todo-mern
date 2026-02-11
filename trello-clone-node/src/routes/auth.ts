import express from "express";
import { getDb } from "../db/connection.ts";
import { compare, hash } from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  // collection
  console.log("::: req", req.body);
  try {
    const db = getDb();
    const collection = db.collection("users");

    let newDocument = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    console.log("::: newDocument", newDocument);

    const isFind = await collection.findOne({ email: newDocument.email });

    console.log("::: isFind", isFind);

    if (isFind) {
      console.log("::: in if");
      // res.status(422).send("Email Already");
      return res.status(422).json({
        status: "fail",
        message: {
          email: "Email Already Exist",
        },
      });
    } else {
      console.log("::: in else");
      newDocument.password = await hash(newDocument.password, 10);
      const result = await collection.insertOne(newDocument);

      // res.status(402).send("Email Already");
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
      // return res.status(400).send("Invalid Credential");
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
        // {
        //   email: "Email Already Exist",
        // },
      });
      // return res.status(400).send("Invalid Credential");
    }

    return res.status(200).json({
      status: "ok",
      message: {
        commonMessage: "Login Success",
      },
    });
    // return res.status(200).send("Login Success");
  } catch (error) {
    console.log("::: error", error);
    res.status(500).send("Server error", error);
  }
});

export default router;
