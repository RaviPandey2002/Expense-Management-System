const generateDemoTransactions = (userId) => {
  const daysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  return [
    { userId, type: "income",  category: "salary",    amount: 3500, description: "Monthly salary",          date: daysAgo(28) },
    { userId, type: "income",  category: "project",   amount: 800,  description: "Freelance project",       date: daysAgo(14) },
    { userId, type: "income",  category: "tip",        amount: 50,   description: "Tips received",           date: daysAgo(6)  },

    { userId, type: "expense", category: "bills",     amount: 120,  description: "Electricity bill",        date: daysAgo(25) },
    { userId, type: "expense", category: "groceries", amount: 95,   description: "Weekly groceries",        date: daysAgo(22) },
    { userId, type: "expense", category: "medical",   amount: 60,   description: "Doctor visit",            date: daysAgo(20) },
    { userId, type: "expense", category: "food",      amount: 45,   description: "Dinner with friends",     date: daysAgo(18) },
    { userId, type: "expense", category: "bills",     amount: 80,   description: "Internet subscription",   date: daysAgo(15) },
    { userId, type: "expense", category: "groceries", amount: 110,  description: "Weekly groceries",        date: daysAgo(10) },
    { userId, type: "expense", category: "food",      amount: 30,   description: "Lunch",                   date: daysAgo(8)  },
    { userId, type: "expense", category: "fee",       amount: 25,   description: "Bank service fee",        date: daysAgo(5)  },
    { userId, type: "expense", category: "tax",       amount: 200,  description: "Quarterly tax payment",   date: daysAgo(3)  },
  ];
};

module.exports = generateDemoTransactions;
