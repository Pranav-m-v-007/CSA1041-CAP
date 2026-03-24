const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('CI/CD Working Successfully! HEllo Guys');
});

app.listen(3000);
