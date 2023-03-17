import express from 'express';
import 'dotenv/config';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from App');
});

// eslint-disable-next-line arrow-body-style
app.listen(process.env.PORT, () => {
  return console.log(`app listening on port ${process.env.PORT}!`);
});
