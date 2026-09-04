require("dotenv").config({
  path: "C:\\Users\\Arsh\\Code-NodeJs\\BACKEND PROJECTS\\Journal\\Backend\\src\\config\\.env",
});
const app = require("./src/app");
const connectDB = require("./src/lib/db");
app.listen(3000, () => {
  console.log("server is running");
});

connectDB();
