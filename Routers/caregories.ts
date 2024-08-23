import express from 'express';
import categoriesDB from "../categoriesDB";
import {CategoryMutation} from '../types';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
  const categories = await categoriesDB.getCategories();
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

  const createdCategory = await categoriesDB.categoryMutation(newCategory);
  res.send(createdCategory);
});

categoriesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const category = await categoriesDB.oneCategory(id);

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

  const category = await categoriesDB.oneCategory(id);

  if (!category) {
    return res.status(404).send({error: "Category not found"});
  }

  const updatedCategory = await categoriesDB.editCategory(req.body, id);
  res.send(updatedCategory);
});

categoriesRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const category = await categoriesDB.oneCategory(id);

  if (!category) {
    return res.status(400).send({error: "Category not found"});
  }

  const result = await categoriesDB.deleteCategory(id);
  res.send(result);
});

export default categoriesRouter;
