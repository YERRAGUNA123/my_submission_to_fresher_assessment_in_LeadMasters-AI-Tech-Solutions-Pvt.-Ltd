// Select (or create) our authentication database
use("authdb"); // Change name if you want

// Create the 'users' collection and insert a sample user
db.users.insertOne({
  username: "testuser",
  password: "testpass", // later we'll hash passwords
  createdAt: new Date()
});

// Show all users to verify
db.users.find({});
