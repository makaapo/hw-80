import express from 'express';
import itemsDB from "../itemsDB";
import {imagesUpload} from "../multer";
import {ItemMutation} from '../types';

const itemsRouter = express.Router();

itemsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  if (!req.body.title || !req.body.category_id || !req.body.location_id) {
    return res.status(400).send({error: "Title, category and location are required"});
  }

  const description = req.body.description || '';

  const newItem: ItemMutation = {
    title: req.body.title,
    category_id: req.body.category_id,
    location_id: req.body.location_id,
    description: description,
    image: req.file ? req.file.filename : null,
  };

  const createItem = await itemsDB.itemMutation(newItem);

  if (createItem !== null) {
    res.send(createItem);
  } else {
    res.status(400).send({error: "Category or location not found"});
  }
});

itemsRouter.get('/', async (req, res) => {
  const items = await itemsDB.getItems();
  res.send(items.reverse());
});

export default itemsRouter;
