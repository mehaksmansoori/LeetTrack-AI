import app from "../server/src/app.js";
import { connectDatabase } from "../server/src/config/db.js";

let databasePromise;

const ensureDatabase = () => {
  databasePromise ||= connectDatabase();
  return databasePromise;
};

export default async function handler(req, res) {
  await ensureDatabase();
  return app(req, res);
}
