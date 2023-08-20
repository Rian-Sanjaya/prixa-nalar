import axios, { CancelToken } from 'axios';
import { getPartnerID, getAppID } from '../utils/constant';

export const signal = axios.CancelToken.source();

export function getAPI(url: string, cancelToken?: CancelToken | undefined, header?: object): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        cancelToken,
        headers: header || {
          Authorization: localStorage.getItem('loginToken')
            ? `Bearer ${localStorage.getItem('loginToken')}`
            : undefined,
          'Content-Type': 'application/json',
          'X-Prixa-API-Key': `${process.env.REACT_APP_API_KEY}`,
          'X-Client-Id': getPartnerID,
          'X-Client-App-Id': getAppID,
        },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function postAPI(url: string, data: object, header?: object): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: url,
        data,
        headers: header || {
          'Content-Type': 'application/json',
          'X-Prixa-API-Key': `${process.env.REACT_APP_API_KEY}`,
          'X-Client-Id': getPartnerID,
          'X-Client-App-Id': getAppID,
          Authorization: localStorage.getItem('loginToken')
            ? `Bearer ${localStorage.getItem('loginToken')}`
            : undefined,
        },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function putAPI(url: string, data: object, header?: object): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: url,
        data,
        headers: header || {
          'Content-Type': 'application/json',
          'X-Prixa-API-Key': `${process.env.REACT_APP_API_KEY}`,
          'X-Client-Id': getPartnerID,
          'X-Client-App-Id': getAppID,
          Authorization: localStorage.getItem('loginToken')
            ? `Bearer ${localStorage.getItem('loginToken')}`
            : undefined,
        },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function patchAPI(url: string, data: object, header?: object): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: url,
        data,
        headers: header || {
          'Content-Type': 'application/json',
          'X-Prixa-API-Key': `${process.env.REACT_APP_API_KEY}`,
          'X-Client-Id': getPartnerID,
          'X-Client-App-Id': getAppID,
          Authorization: localStorage.getItem('loginToken')
            ? `Bearer ${localStorage.getItem('loginToken')}`
            : undefined,
        },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteAPI(url: string): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-Prixa-API-Key': `${process.env.REACT_APP_API_KEY}`,
          'X-Client-Id': getPartnerID,
          'X-Client-App-Id': getAppID,
          Authorization: localStorage.getItem('loginToken')
            ? `Bearer ${localStorage.getItem('loginToken')}`
            : undefined,
        },
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}
