let databasePromise;
let appPromise;

const getApp = async () => {
  appPromise ||= import("../server/src/app.js");
  return appPromise;
};

const ensureDatabase = () => {
  databasePromise ||= import("../server/src/config/db.js").then(({ connectDatabase }) =>
    connectDatabase()
  );
  return databasePromise;
};

export default async function handler(req, res) {
  try {
    const { default: app } = await getApp();

    if (req.url !== "/api/health") {
      await ensureDatabase();
    }

    return app(req, res);
  } catch (error) {
    console.error("[api] startup failed", error);
    return res.status(500).json({
      message: error.message || "API startup failed."
    });
  }
}
