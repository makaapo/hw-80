import {promises as fs} from 'fs';
import crypto from 'crypto';
import {Category, CategoryMutation} from './types';


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
  async categoryById(id: string) {

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
      let category = await this.categoryById(id);
      if (category) {
        category = {...category, ...categoryBody};
        data.push(category);
        await this.save();

        return category;
      } else {
        return 'This category was not found';
      }
    }
  },
  async save() {
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
  },
};

export default categoriesDb;