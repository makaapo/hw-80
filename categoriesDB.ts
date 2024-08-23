import {promises as fs} from 'fs';
import crypto from 'crypto';
import {Category, CategoryMutation} from './types';
import itemsDB from './itemsDB';


const fileName = './categories.json';
let data: Category[] = [];

const categoriesDb = {
  async init() {
    try {
      const fileContents = await fs.readFile(fileName);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      data = [];
    }
  },

  async getCategories() {
    return data;
  },

  async categoryMutation(category: CategoryMutation) {
    const id = crypto.randomUUID();
    const newCategory = {...category, id}

    data.push(newCategory);
    await this.save();

    return newCategory;
  },
  async oneCategory(id: string) {

    if (data.length > 0 && id) {
      let category: Category | undefined = data.find(category => category.id === id);

      if (category !== undefined) {
        return category;
      } else  {
        return null;
      }
    }
  },
  async editCategory(categoryBody: Category, id: string) {
    if (data.length > 0 && id) {
      let category = await this.oneCategory(id);
      if (category) {
        category = {...category, ...categoryBody};
        await this.deleteCategory(id);
        data.push(category);
        await this.save();

        return category;
      } else {
        return 'This category was not found';
      }
    }
  },

  async deleteCategory(id: string) {
    if (data.length > 0 && id) {
      let category = await this.oneCategory(id);
      let itemWithCategory = await itemsDB.findItemWithCategoryOrLocation(id);

      if (category === null) {
        return 'This category was not found';
      }

      if (category && !itemWithCategory) {
        data = data.filter(category => category.id !== id);
        await this.save();
        return 'Category was deleted';
      } else if (category && itemWithCategory) {
        return 'The item has this category ID, first remove the item with this category ID.';
      }
    }
  },

  async save() {
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
  },
};

export default categoriesDb;