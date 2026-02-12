import { Db } from "mongodb";

export const initCollections = async (db: Db) => {
  const existingCollections = db.listCollections().toArray();

  const names = (await existingCollections).map((c) => c.name);

  if (!names.includes("todo")) {
    await db.createCollection("todo", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name"],
          properties: {
            name: { bsonType: "string" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });
    console.log("✅ tasks collection created");
  }

  if (!names.includes("todo-task")) {
    await db.createCollection("todo-task", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "todoId"],
          properties: {
            name: { bsonType: "string" },
            todoId: { bsonType: "objectId" },
            createdAt: { bsonType: "date" },
            updatedAt: { bsonType: "date" },
          },
        },
      },
    });
    console.log("✅ todo-task collection created");
  }
};
