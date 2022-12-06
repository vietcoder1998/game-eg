const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/:name", (req, res) => {
  const name = req.params.name;
  res.sendFile(__dirname + `/public/${name}`);
});
app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
