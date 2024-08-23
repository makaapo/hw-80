import express from 'express';
import categoriesDB from './categoriesDB';
import categoriesRouter from './Routers/caregories';
import locationsRouter from './Routers/locations';
import itemsRouter from './Routers/items';
import locationsDB from './locationsDB';
import itemsDB from './itemsDB';


const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/items', itemsRouter);
const run = async () => {
  await categoriesDB.init();
  await locationsDB.init();
  await itemsDB.init();

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });
};

run().catch(console.error);