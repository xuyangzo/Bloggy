const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routers/api/users");
const posts = require("./routers/api/posts");
const searches = require("./routers/api/search");
const app = express();

require("dotenv").config();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ extended: true, limit: "50mb" }));

// CORS support
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// DB Config
const db = process.env.MONGO_URI;

// Connet to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/search", searches);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  const publicPath = path.join(__dirname, "public", "client", "build");

  // // support SEO
  // app.use(
  //   require("prerender-node").set("prerenderToken", "19ZUm6zRkx0SsRy5Blcn")
  // );

  app.use(express.static(publicPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

const port = process.env.PORT || 8081;

app.listen(port, () => console.log(`Server running on port ${port}`));
