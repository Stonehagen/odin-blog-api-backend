import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

// eslint-disable-next-line operator-linebreak
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from App' });
});

// eslint-disable-next-line arrow-body-style
app.listen(process.env.PORT, () => {
  return console.log(`app listening on port ${process.env.PORT}!`);
});
