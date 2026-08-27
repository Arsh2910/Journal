const app = require("./src/app");
const connectDB = require("./src/db/db.js");
app.listen(3000, () => {
  console.log("server is running");
});

connectDB();
