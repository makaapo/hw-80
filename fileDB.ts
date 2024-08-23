import {promises as fs} from 'fs';
import crypto from 'crypto';
import {Item, ItemMutation, Location, LocationMutation, Category, CategoryMutation} from './types';

const itemsFileName = './items.json';
const locationsFileName = './locations.json';
const categoriesFileName = './categories.json';

let itemsData: Item[] = [];
let locationsData: Location[] = [];
let categoriesData: Category[] = [];

const fileDB = {
  async init() {
    try {
      const itemsFileContents = await fs.readFile(itemsFileName);
      itemsData = JSON.parse(itemsFileContents.toString());
    } catch (e) {
      itemsData = [];
    }

    try {
      const locationsFileContents = await fs.readFile(locationsFileName);
      locationsData = JSON.parse(locationsFileContents.toString());
    } catch (e) {
      locationsData = [];
    }

    try {
      const categoriesFileContents = await fs.readFile(categoriesFileName);
      categoriesData = JSON.parse(categoriesFileContents.toString());
    } catch (e) {
      categoriesData = [];
    }
  },

  async getItems() {
    return itemsData;
  },

  async itemMutation(item: ItemMutation) {
    const id = crypto.randomUUID();
    const newItem: Item = {...item, id};

    let category = await this.oneCategory(item.category_id);
    let location = await this.oneLocation(item.location_id);

    if (category !== null && location !== null) {
      itemsData.push(newItem);
      await this.saveItems();

      return newItem;
    } else {
      return null;
    }
  },

  async findItem(id: string) {
    if (itemsData.length > 0 && id) {
      return itemsData.find(item => item.id === id) || null;
    }
  },

  async findItemWithCategoryOrLocation(id: string) {
    if (!id) {
      return false;
    }

    const itemByCategory = itemsData.find(item => item.category_id === id);
    const itemByLocation = itemsData.find(item => item.location_id === id);

    return !!(itemByCategory || itemByLocation);
  },

  async deleteItem(id: string) {
    if (itemsData.length > 0 && id) {
      let item = await this.findItem(id);

      if (item) {
        itemsData = itemsData.filter(item => item.id !== id);
        await this.saveItems();
        return 'Item deleted';
      } else {
        return 'Item not found';
      }
    }
  },

  async editItem(items: Item, id: string) {
    if (itemsData.length > 0 && id) {
      let item = await this.findItem(id);

      if (item) {
        item = {...item, ...items};
        await this.deleteItem(id);
        itemsData.push(item);
        await this.saveItems();

        return item;
      } else {
        return 'Item not found';
      }
    }
  },

  async getLocations() {
    return locationsData;
  },

  async locationMutation(location: LocationMutation) {
    const id = crypto.randomUUID();
    const newLocation = {...location, id};

    locationsData.push(newLocation);
    await this.saveLocations();

    return newLocation;
  },

  async oneLocation(id: string) {
    if (locationsData.length > 0 && id) {
      let location = locationsData.find(location => location.id === id);
      return location || null;
    }
  },

  async editLocation(inLocation: Location, id: string) {
    if (locationsData.length > 0 && id) {
      let location = await this.oneLocation(id);

      if (location) {
        locationsData = locationsData.filter(location => location.id !== id);

        const updatedLocation = {...location, ...inLocation};
        locationsData.push(updatedLocation);

        await this.saveLocations();

        return updatedLocation;
      } else {
        return 'Location not found';
      }
    }
  },

  async deleteLocation(id: string) {
    if (locationsData.length > 0 && id) {
      let location = await this.oneLocation(id);
      let itemWithLocation = await this.findItemWithCategoryOrLocation(id);

      if (location === null) {
        return 'Location not found';
      }

      if (location && !itemWithLocation) {
        locationsData = locationsData.filter(location => location.id !== id);
        await this.saveLocations();
        return 'Location deleted';
      } else if (location && itemWithLocation) {
        return 'The item has this location ID, first remove the item with this location ID.';
      }
    }
  },

  async getCategories() {
    return categoriesData;
  },

  async categoryMutation(category: CategoryMutation) {
    const id = crypto.randomUUID();
    const newCategory = {...category, id};

    categoriesData.push(newCategory);
    await this.saveCategories();

    return newCategory;
  },

  async oneCategory(id: string) {
    if (categoriesData.length > 0 && id) {
      let category = categoriesData.find(category => category.id === id);
      return category || null;
    }
  },

  async editCategory(categoryBody: Category, id: string) {
    if (categoriesData.length > 0 && id) {
      let category = await this.oneCategory(id);

      if (category) {
        categoriesData = categoriesData.filter(category => category.id !== id);

        const updatedCategory = {...category, ...categoryBody};
        categoriesData.push(updatedCategory);

        await this.saveCategories();

        return updatedCategory;
      } else {
        return 'Category not found';
      }
    }
  },

  async deleteCategory(id: string) {
    if (categoriesData.length > 0 && id) {
      let category = await this.oneCategory(id);
      let itemWithCategory = await this.findItemWithCategoryOrLocation(id);

      if (category === null) {
        return 'Category not found';
      }

      if (category && !itemWithCategory) {
        categoriesData = categoriesData.filter(category => category.id !== id);
        await this.saveCategories();
        return 'Category deleted';
      } else if (category && itemWithCategory) {
        return 'The item has this category ID, first remove the item with this category ID.';
      }
    }
  },

  async saveItems() {
    return fs.writeFile(itemsFileName, JSON.stringify(itemsData, null, 2));
  },

  async saveLocations() {
    return fs.writeFile(locationsFileName, JSON.stringify(locationsData, null, 2));
  },

  async saveCategories() {
    return fs.writeFile(categoriesFileName, JSON.stringify(categoriesData, null, 2));
  },
};

export default fileDB;