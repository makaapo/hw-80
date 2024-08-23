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

    let category = await CategoriesDB.oneCategory(item.category_id);
    let location = await LocationsDB.oneLocation(item.location_id);

    if (category !== null && location !== null) {
      data.push(newItem);
      await this.save();

      return newItem;
    } else {
      return null;
    }
  },

  async findItem(id: string) {
    if (data.length > 0 && id) {
      return data.find(item => item.id === id) || null;
    }
  },

  async findItemWithCategoryOrLocation(id: string) {
    if (!id) {
      return false;
    }

    const itemByCategory = data.find(item => item.category_id === id);
    const itemByLocation = data.find(item => item.location_id === id);

    return !!(itemByCategory || itemByLocation);
  },

  async deleteItem(id: string) {
    if (data.length > 0 && id) {
      let item = await this.findItem(id);

      if (item) {
        data = data.filter(item => item.id !== id);
        await this.save();
        return 'Item deleted';
      } else {
        return 'Item is not found';
      }
    }
  },
  async editItem(items: Item, id: string) {
    if (data.length > 0 && id) {
      let item = await this.findItem(id);

      if (item) {
        item = {...item, ...items};
        await this.deleteItem(id);
        data.push(item);
        await this.save();

        return item;
      } else {
        return 'Item is not found';
      }
    }
  },

  async save() {
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
  },
};

export default itemsDb;