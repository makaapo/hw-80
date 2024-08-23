import express from 'express';
import categoriesRouter from './Routers/caregories';
import locationsRouter from './Routers/locations';
import itemsRouter from './Routers/items';
import fileDB from './fileDB';


const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/items', itemsRouter);
const run = async () => {
  await fileDB.init();

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(console.error);