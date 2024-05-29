process.on("warning", (e) => console.warn(e.stack));

// Requirements: express, express-session, cors
const express = require("express");
const session = require("express-session");
const cors = require("cors");

// Requirements: routes
const passport = require("passport");
const helmet = require("helmet");
require("../server/config/auth.js");
// Para rutas del Server
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
//

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

const app = express();
const port = 3000;

/* app.use(express.urlencoded()); */
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Requirements: routes
const contactRoutes = require("./routes/contact.routes");
const newslettertRoutes = require("./routes/newsletter.routes");
const signupRoutes = require("./routes/signup.routes.js");
const loginRoutes = require("./routes/login.routes.js");
const logoutRoutes = require("./routes/logout.routes.js")
const clientRoutes = require("./routes/client.routes.js");

// Middlewares
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'",
        "https://accounts.google.com",
        "https://chatybe.streamlit.app",
        "https://destinomap.streamlit.app"]
    }
  }
}));
app.use(express.json());
app.use(session({ secret: "beyond-education" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

/* ----- WEB ROUTES ----- */
// http://localhost:3000/
// Home page
// Serve static assets in production
app.use(express.static("client/dist"));
app.use(express.static(path.join(__dirname, "/../client/dist")));


// http://localhost:3000/auth
// Page shows a button with a link that redirects to '/auth/google'
app.get("/auth", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with google</a>');
});

// http://localhost:3000/auth/google
// Shows user selection through Google and allows Sign-up and Sign-in
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// http://localhost:3000/google/callback
// Handles whether Sign-in was successful or not to access the protected route
app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

// http://localhost:3000/auth/failure
// Redirects the user if the sign-in was un-successful
app.get("/auth/failure", (req, res) => {
  res.send("Authentication failed");
});

// http://localhost:3000/protected
// Redirects the user if the sign-in was successful
app.get("/protected", isLoggedIn, (req, res) => {
  res.send("Hello User");
});

/* ----- API ROUTES ----- */
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newslettertRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/user", clientRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../client/dist", "index.html"));
});

const server = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

module.exports = server;
