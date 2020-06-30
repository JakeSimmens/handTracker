const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("handSounds");
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Hand sounds server running");
});