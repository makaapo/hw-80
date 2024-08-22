import express from 'express';
import categoriesDB from './categoriesDB';
import categoriesRouter from './Routers/caregories';
import cors from 'cors';


const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use('/categories', categoriesRouter);

const run = async () => {
  await categoriesDB.init();

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(console.error);