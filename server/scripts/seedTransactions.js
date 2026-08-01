"use strict";

const path        = require("path");
const dotenv      = require("dotenv");
const mongoose    = require("mongoose");
const bcrypt      = require("bcryptjs");
const User        = require("../models/userModel");
const Transaction = require("../models/transactionModel");

dotenv.config({ path: path.join(__dirname, "../.env") });

const SEED_USER_EMAIL    = process.env.SEED_USER_EMAIL;
const SEED_USER_NAME     = process.env.SEED_USER_NAME     || "Test User";
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD || "Test@1234";

if (!process.env.MONGO_URL) {
  console.error("❌  MONGO_URL is not set in .env");
  process.exit(1);
}

if (!SEED_USER_EMAIL) {
  console.error("❌  SEED_USER_EMAIL is not set in .env");
  console.error("    Add:  SEED_USER_EMAIL=your@email.com");
  process.exit(1);
}

// ── Helper: date N days before today ─────────────────────────────────────────
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const TRANSACTIONS = [
  // ── Income ──────────────────────────────────────────────────────────────────
  { type:"income",  category:"salary",    amount:4500, description:"Monthly salary",            date:daysAgo(2)   },
  { type:"income",  category:"salary",    amount:4500, description:"Monthly salary",            date:daysAgo(32)  },
  { type:"income",  category:"salary",    amount:4500, description:"Monthly salary",            date:daysAgo(62)  },
  { type:"income",  category:"salary",    amount:4500, description:"Monthly salary",            date:daysAgo(92)  },
  { type:"income",  category:"salary",    amount:4500, description:"Monthly salary",            date:daysAgo(122) },
  { type:"income",  category:"project",   amount:1200, description:"Freelance web project",     date:daysAgo(10)  },
  { type:"income",  category:"project",   amount:850,  description:"Logo design contract",      date:daysAgo(45)  },
  { type:"income",  category:"project",   amount:2000, description:"API integration project",   date:daysAgo(80)  },
  { type:"income",  category:"tip",       amount:120,  description:"Client tip",                date:daysAgo(15)  },
  { type:"income",  category:"tip",       amount:75,   description:"Referral bonus",            date:daysAgo(55)  },
  { type:"income",  category:"fee",       amount:300,  description:"Consulting fee",            date:daysAgo(20)  },
  { type:"income",  category:"fee",       amount:500,  description:"Workshop fee received",     date:daysAgo(100) },

  // ── Expenses ─────────────────────────────────────────────────────────────────
  { type:"expense", category:"groceries", amount:180,  description:"Weekly grocery run",        date:daysAgo(3)   },
  { type:"expense", category:"groceries", amount:210,  description:"Supermarket — monthly",     date:daysAgo(35)  },
  { type:"expense", category:"groceries", amount:195,  description:"Supermarket — monthly",     date:daysAgo(65)  },
  { type:"expense", category:"groceries", amount:170,  description:"Weekly grocery run",        date:daysAgo(95)  },
  { type:"expense", category:"food",      amount:45,   description:"Dinner with friends",       date:daysAgo(5)   },
  { type:"expense", category:"food",      amount:28,   description:"Lunch at cafe",             date:daysAgo(8)   },
  { type:"expense", category:"food",      amount:62,   description:"Team lunch",                date:daysAgo(22)  },
  { type:"expense", category:"food",      amount:38,   description:"Pizza night",               date:daysAgo(50)  },
  { type:"expense", category:"food",      amount:55,   description:"Birthday dinner",           date:daysAgo(110) },
  { type:"expense", category:"bills",     amount:95,   description:"Electricity bill",          date:daysAgo(6)   },
  { type:"expense", category:"bills",     amount:40,   description:"Internet bill",             date:daysAgo(7)   },
  { type:"expense", category:"bills",     amount:95,   description:"Electricity bill",          date:daysAgo(36)  },
  { type:"expense", category:"bills",     amount:40,   description:"Internet bill",             date:daysAgo(37)  },
  { type:"expense", category:"bills",     amount:95,   description:"Electricity bill",          date:daysAgo(66)  },
  { type:"expense", category:"bills",     amount:40,   description:"Internet bill",             date:daysAgo(97)  },
  { type:"expense", category:"medical",   amount:150,  description:"Doctor consultation",       date:daysAgo(18)  },
  { type:"expense", category:"medical",   amount:85,   description:"Pharmacy",                  date:daysAgo(19)  },
  { type:"expense", category:"medical",   amount:220,  description:"Dental checkup",            date:daysAgo(90)  },
  { type:"expense", category:"movie",     amount:32,   description:"Cinema tickets x2",         date:daysAgo(12)  },
  { type:"expense", category:"movie",     amount:15,   description:"Netflix subscription",      date:daysAgo(30)  },
  { type:"expense", category:"movie",     amount:15,   description:"Netflix subscription",      date:daysAgo(60)  },
  { type:"expense", category:"movie",     amount:15,   description:"Netflix subscription",      date:daysAgo(90)  },
  { type:"expense", category:"tax",       amount:620,  description:"Quarterly tax payment",     date:daysAgo(25)  },
  { type:"expense", category:"tax",       amount:620,  description:"Quarterly tax payment",     date:daysAgo(115) },
  { type:"expense", category:"fee",       amount:30,   description:"Bank transaction fee",      date:daysAgo(14)  },
  { type:"expense", category:"fee",       amount:99,   description:"Annual software licence",   date:daysAgo(70)  },
  { type:"expense", category:"other",     amount:250,  description:"Home repair",               date:daysAgo(130) },
];

const seed = async () => {
  const mongoUrl = process.env.MONGO_URL;
  const dbName = new URL(mongoUrl).pathname.replace(/^\//, "") || "expense-management";
  console.log(`\n🔌  Connecting to database: ${dbName}`);
  await mongoose.connect(mongoUrl);
  console.log("✅  Connected.\n");

  // Find user by email — create if not found
  let user = await User.findOne({ email: SEED_USER_EMAIL.toLowerCase() }).lean();
  if (!user) {
    console.log(`⚠️   No user found with email: ${SEED_USER_EMAIL}`);
    console.log(`➕  Creating new user: ${SEED_USER_NAME} <${SEED_USER_EMAIL}>\n`);
    const hashed = await bcrypt.hash(SEED_USER_PASSWORD, 10);
    const created = await User.create({
      name:     SEED_USER_NAME,
      email:    SEED_USER_EMAIL.toLowerCase(),
      password: hashed,
    });
    user = created.toObject();
    console.log(`✅  User created.`);
    console.log(`    Name:     ${user.name}`);
    console.log(`    Email:    ${user.email}`);
    console.log(`    Password: ${SEED_USER_PASSWORD}  ← save this!\n`);
  } else {
    console.log(`👤  Found existing user: ${user.name} <${user.email}>`);

    // Guard: skip seeding if the user already has more than 10 transactions
    const existingCount = await Transaction.countDocuments({ userId: user._id });
    if (existingCount > 10) {
      console.log(`⏭️   Skipping seed — user already has ${existingCount} transactions.\n`);
      await mongoose.disconnect();
      console.log("🔌  Disconnected. Done.\n");
      return;
    }
    console.log(`    Existing transactions: ${existingCount} — proceeding with seed.\n`);
  }

  // Attach userId and insert
  const docs = TRANSACTIONS.map((t) => ({ ...t, userId: user._id }));
  const result = await Transaction.insertMany(docs);

  console.log(`\n✅  Inserted ${result.length} transactions into "${dbName}"`);
  console.log(`    Income:   ${docs.filter(t => t.type === "income").length} records`);
  console.log(`    Expense:  ${docs.filter(t => t.type === "expense").length} records`);
  console.log(`    Date span: last 130 days\n`);

  await mongoose.disconnect();
  console.log("🔌  Disconnected. Done.\n");
};

seed().catch((err) => {
  console.error("❌  Seeder failed:", err.message);
  process.exit(1);
});
