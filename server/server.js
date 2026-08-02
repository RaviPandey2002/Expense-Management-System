const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./config/connectDb");

const PORT = process.env.PORT || 8000;
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running successfully on PORT http://localhost:${PORT}`);

  const Transaction = require("./models/transactionModel");

  const runCleanup = async () => {
    try {
      const orphanResult = await Transaction.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $match: { user: { $size: 0 } } },
        { $group: { _id: "$userId" } },
      ]);

      if (orphanResult.length > 0) {
        const orphanIds = orphanResult.map((r) => r._id);
        const { deletedCount } = await Transaction.deleteMany({ userId: { $in: orphanIds } });
        if (deletedCount > 0) {
          console.log(`[demo-cleanup] Removed ${deletedCount} orphaned transaction(s)`);
        }
      }
    } catch (err) {
      console.error("[demo-cleanup] Error:", err.message);
    }
  };

  setTimeout(() => {
    runCleanup();
    setInterval(runCleanup, 30 * 60 * 1000);
  }, 10_000);
});
