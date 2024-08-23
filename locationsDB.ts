import {promises as fs} from 'fs';
import crypto from 'crypto';
import {LocationMutation, Location} from './types';


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

        return location;
      } else {
        return 'Location not found';
      }
    }
  },
  async save() {
    return fs.writeFile(fileName, JSON.stringify(data, null, 2));
  },
};

export default locationsDB;