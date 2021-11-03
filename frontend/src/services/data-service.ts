import { AppData } from './../type.d';
import axios from 'axios';


const API_URL = 'http://localhost:3000/data';

const DataService = {
   getFreshData: async (): Promise<AppData> => {
      return (await axios.get(API_URL)).data;
   }
}


export default DataService;