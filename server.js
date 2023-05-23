// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

console.log(path.join(__dirname, "dist"));
app.use(express.static(path.join(__dirname, "dist")));

app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}!`);
}); 