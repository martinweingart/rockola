import * as axios from 'axios';
import config from '@/config'

export default axios.create({
  baseURL: config.api,
  withCredentials: false
});