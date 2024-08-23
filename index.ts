import express from 'express';
import categoriesDB from './categoriesDB';
import categoriesRouter from './Routers/caregories';
import locationsRouter from './Routers/locations';
import locationsDB from './locationsDB';


const app = express();
const port = 8000;

app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
const run = async () => {
  await categoriesDB.init();
  await locationsDB.init();

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(console.error);