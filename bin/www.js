'use strict';

const app = require('../app');
// const PORT = 8000;

app.listen(process.env.PORT, () => {
  console.log(`Server is listening PORT:${process.env.PORT}`);
});