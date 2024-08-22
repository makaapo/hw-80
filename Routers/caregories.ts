import {Router} from 'express';
import categoriesDB from "../categoriesDB";
import {Category, CategoryMutation} from '../types';
const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
  let category: Category[];

  category = await categoriesDB.getCategories();
  category = category.reverse();
  res.send(category);
});

categoriesRouter.post('/', async (req, res) => {
  if (!req.body.title) {
    res.status(404).send({error: "Title the request"});
  }

  let description = req.body.description ? req.body.description : '';

  let newCategory: CategoryMutation = {
    title: req.body.title,
    description: description,
  };

  newCategory = await categoriesDB.categoryMutation(newCategory);
  res.send(newCategory);
});


categoriesRouter.get('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({error: "Error when requesting by ID"});
  }

  let category = await categoriesDB.categoryById(req.params.id);

  if (category) {
    res.send(category);
  } else {
    res.send('This category not found');
  }
});

categoriesRouter.put('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({error: "Editing error"});
  }

  if (req.body.id) {
    res.status(400).send({error: "ID cannot change"});
  }

  if (req.body.title || req.body.description) {
    let category = await categoriesDB.editCategory(req.body, req.params.id);
    res.send(category);
  } else {
    res.status(400).send({error: "There can only be a title and description"});
  }
});


export default categoriesRouter