import express from 'express';
import locationsDB from "../locationsDB";
import {LocationMutation} from '../types';

const locationsRouter = express.Router();

locationsRouter.post('/', async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({error: "Title required"});
  }

  const description = req.body.description || '';

  const newLocation: LocationMutation = {
    title: req.body.title,
    description: description,
  };

  const createdLocation = await locationsDB.locationMutation(newLocation);
  res.send(createdLocation);
});

locationsRouter.get('/', async (req, res) => {
  const locations = await locationsDB.getLocations();
  res.send(locations.reverse());
});

locationsRouter.get('/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const location = await locationsDB.oneLocation(id);

  if (location) {
    res.send(location);
  } else {
    res.status(400).send({error: "Location not found"});
  }
});

locationsRouter.put('/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  if (req.body.id) {
    return res.status(400).send({error: "ID cannot be changed"});
  }

  const location = await locationsDB.oneLocation(id);

  if (!location) {
    return res.status(400).send({error: "Error getting location"});
  }

  const updatedLocation = await locationsDB.editLocation(req.body, id);
  res.send(updatedLocation);
});

locationsRouter.delete('/:id', async (req, res) => {
  const {id} = req.params;

  if (!id) {
    return res.status(400).send({error: "ID required"});
  }

  const location = await locationsDB.oneLocation(id);

  if (!location) {
    return res.status(400).send({error: "Location not found"});
  }

  const result = await locationsDB.deleteLocation(id);
  res.send({message: result});
});

export default locationsRouter;
