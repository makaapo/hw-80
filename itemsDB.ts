import {promises as fs} from 'fs';
import crypto from 'crypto';
import CategoriesDB from './categoriesDB';
import LocationsDB from './locationsDB';
import {Item, ItemMutation} from './types';


const fileName = './items.json';
let data: Item[] = [];

const itemsDb = {
  async init() {
    try {
      const fileContents = await fs.readFile(fileName);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      data = [];
    }
  },
  async getItems() {
    return data;
  },
  async itemMutation (item: ItemMutation) {
    const id = crypto.randomUUID();
    const newItem: Item = {...item, id}

    let category = await CategoriesDB.categoryById(item.category_id);
    let location = await LocationsDB.oneLocation(item.location_id);

    if (category !== null && location !== null) {
      data.push(newItem);
      await this.save();

      return newItem;
    } else {
      return null;
    }
  },

  async save() {
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
  },
};

export default itemsDb;