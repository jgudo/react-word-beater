const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();
const publicPath = path.join(__dirname, '../../public');

app.use(express.static(publicPath));

console.log(publicPath);
app.listen(port, () => {
  console.log('Server is running on port ', port);
});
