import { Db } from "mongodb";

export const name = "001-add-favourite-todo-task";

export const up = async (db: Db) => {
  await db.command({
    collMod: "todo-task",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "todoId", "favourite"],
        properties: {
          name: { bsonType: "string" },
          todoId: { bsonType: "objectId" },
          favourite: { bsonType: "bool" },
        },
      },
    },
  });

  await db
    .collection("todo-task")
    .updateMany(
      { favourite: { $exists: false } },
      { $set: { favourite: false } },
    );
};
