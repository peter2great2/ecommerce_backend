console.log("Testing Node.js server startup...");
console.log("Node version:", process.version);
console.log("Current working directory:", process.cwd());

try {
  console.log("Testing require...");
  const express = require("express");
  console.log("Express loaded successfully");

  const app = express();
  app.get("/", (req, res) => {
    res.send("Test server is working!");
  });

  const server = app.listen(3001, () => {
    console.log("Test server is running on port 3001");
    setTimeout(() => {
      server.close();
      console.log("Test server closed successfully");
      process.exit(0);
    }, 2000);
  });
} catch (error) {
  console.error("Error starting test server:", error);
  process.exit(1);
}
