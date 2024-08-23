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

itemsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const item = await itemsDB.findItem(id);

  if (item) {
    res.send(item);
  } else {
    res.status(400).send({error: "Item not found"});
  }
});

itemsRouter.put('/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  if (req.body.id) {
    return res.status(400).send({error: "ID cannot be changed"});
  }

  const item = await itemsDB.findItem(id);

  if (!item) {
    return res.status(400).send({error: "Item not found"});
  }

  const updatedItem = await itemsDB.editItem(req.body, id);
  res.send(updatedItem);
});

itemsRouter.delete('/:id', async (req, res) => {
  const {id } = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const item = await itemsDB.findItem(id);

  if (!item) {
    return res.status(400).send({error: "Item not found"});
  }

  const result = await itemsDB.deleteItem(id);
  res.send(result);
});

export default itemsRouter;
