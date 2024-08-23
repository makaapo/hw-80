import {promises as fs} from 'fs';
import crypto from 'crypto';
import {LocationMutation, Location} from './types';
import itemsDB from './itemsDB';


const fileName = './locations.json';
let data: Location[] = [];

const locationsDB = {
  async init() {
    try {
      const fileContents = await fs.readFile(fileName);
      data = JSON.parse(fileContents.toString());
    } catch (e) {
      data = [];
    }
  },

  async getLocations() {
    return data;
  },

  async locationMutation(location: LocationMutation) {
    const id = crypto.randomUUID();
    const newLocation = {...location, id}

    data.push(newLocation);
    await this.save();

    return newLocation;
  },

  async oneLocation(id: string) {

    if (data.length > 0 && id) {
      let location: Location | undefined = data.find(location => location.id === id);

      if (location !== undefined) {
        return location;
      } else  {
        return null;
      }
    }
  },

  async editLocation(inLocation: Location, id: string) {
    if (data.length > 0 && id) {
      let location = await this.oneLocation(id);

      if (location) {
        location = {...location, ...inLocation};
        data.push(location);
        await this.save();
        await this.deleteLocation(id);
        return location;
      } else {
        return 'Location not found';
      }
    }
  },
  async deleteLocation(id: string) {
    if (data.length > 0 && id) {
      let location = await this.oneLocation(id);
      let itemWithLocation = await itemsDB.findItemWithCategoryOrLocation(id);

      if (location === null) {
        return 'This location was not found';
      }

      if (location && !itemWithLocation) {
        data = data.filter(location => location.id !== id);
        await this.save();
        return 'Location deleted';
      } else if (location && itemWithLocation) {
        return 'The item has this location ID, first remove the item with this location ID.';
      }
    }
  },


  async save() {
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
  },
};

export default locationsDB;