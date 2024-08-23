import express from 'express';

import {CategoryMutation} from '../types';
import fileDB from '../fileDB';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
  const categories = await fileDB.getCategories();
  res.send(categories.reverse());
});

categoriesRouter.post('/', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({error: "Title required"});
  }

  const description = req.body.description || '';

  const newCategory: CategoryMutation = {
    title: req.body.title,
    description: description,
  };

  const createdCategory = await fileDB.categoryMutation(newCategory);
  res.send(createdCategory);
});

categoriesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const category = await fileDB.oneCategory(id);

  if (category) {
    res.send(category);
  } else {
    res.status(404).send({error: "Category not found"});
  }
});

categoriesRouter.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  if (req.body.id) {
    return res.status(400).send({error: "ID cannot be changed"});
  }

  const category = await fileDB.oneCategory(id);

  if (!category) {
    return res.status(404).send({error: "Category not found"});
  }

  const updatedCategory = await fileDB.editCategory(req.body, id);
  res.send(updatedCategory);
});

categoriesRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const category = await fileDB.oneCategory(id);

  if (!category) {
    return res.status(400).send({error: "Category not found"});
  }

  const result = await fileDB.deleteCategory(id);
  res.send(result);
});

export default categoriesRouter;
