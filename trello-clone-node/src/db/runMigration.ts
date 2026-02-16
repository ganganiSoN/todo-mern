import fs from "fs";
import path from "path";
import { Db } from "mongodb";
import { fileURLToPath, pathToFileURL } from "url";

export const runMigration = async (db: Db) => {
  const migrationCollection = db.collection("migrations");

  const executed = await migrationCollection.find().toArray();
  const executedName = executed.map((e) => e.name);

  const fileName = fileURLToPath(import.meta.url);
  const __dirName = path.dirname(fileName);

  const migrationPath = path.join(__dirName, "migrations");

  const files = fs
    .readdirSync(migrationPath)
    .filter((file) => file.endsWith(".ts"))
    .sort();

  for (const file of files) {
    const fullPath = path.join(migrationPath, file);

    const fileUrl = pathToFileURL(fullPath).href;

    const migration = await import(fileUrl);

    if (!executedName.includes(migration.name)) {
      console.log("::: Running Migration", migration.name);

      await migration.up(db);

      await migrationCollection.insertOne({
        name: migration.name,
        createdAt: new Date(),
      });

      console.log("✅ Done:", migration.name);
    }
  }
};
