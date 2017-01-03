import Logger from './logger'
import {AsyncStorage} from 'react-native'

const logger = Logger('Cache');

export default Cache = {
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      logger.info('SET', key, value)
    } catch (error) {
      logger.warn('SET ERROR', key, value, error)
    }
  },
  async get(key) {
    try {
      const value = JSON.parse(await AsyncStorage.getItem(key));
      logger.info('GET', key, value);
      return value;
    } catch (error) {
      logger.warn('GET ERROR', key, error)
    }
  }
}