const express = require('express');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;
const app = express();
const publicPath = path.join(__dirname, '../../public');

app.use(express.static(publicPath));

app.get('/service-worker.js', (req, res) => {
  res.set({ 'Content-Type': 'application/javascript; charset=utf-8' });
  res.send(fs.readFileSync('build/service-worker.js'));
});

console.log(publicPath);
app.listen(port, () => {
  console.log('Server is running on port ', port);
});
