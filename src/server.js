import connectDB from "./config/db.js";
import app from "./app.js";
import logger from "./middleware/logger.js";
import "dotenv/config";

// Connect to MongoDB
if (process.env.NODE_ENV !== "test") {
  connectDB(); // hanya connect ke Mongo asli kalau bukan test
}
// Global error handler
app.use((err, req, res, next) => {
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(process.env.PORT, () => {
  logger.info(`Server running on port ${process.env.PORT}`);
});
