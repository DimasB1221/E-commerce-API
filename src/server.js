import connectDB from "./config/db.js";
import app from "./app.js";
import "dotenv/config";

// Connect to MongoDB
if (process.env.NODE_ENV !== "test") {
  connectDB(); // hanya connect ke Mongo asli kalau bukan test
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
