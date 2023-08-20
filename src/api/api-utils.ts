/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { postAPI, getAPI } from '../api/api-method';
import { DIAGNOSTIC_API, USER_API } from '../api/api-url';
import { getUID, logOut } from '../utils/constant';

const complaint = `${process.env.REACT_APP_ASSET_URL}/illustrations/Prixa Assessment - Input.png`;

export interface GeoLocationType {
  latitude: number;
  longitude: number;
}

export let currentState = '';

export let sessionId =
  localStorage.getItem('sesId') && localStorage.getItem('sesId') !== '' ? localStorage.getItem('sesId') : 'none';
export const geoLocation: GeoLocationType = {
  latitude: 0,
  longitude: 0,
};

export function getConversation(params: { reply?: object; geoLocation?: GeoLocationType }): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const data: any = await postAPI(DIAGNOSTIC_API.CONVERSATION, {
        sessionId: sessionId,
        reply:
          localStorage.getItem('sesId') && localStorage.getItem('sesId') !== '' && !params.reply
            ? { type: 'resume' }
            : params.reply,
        geoLocation: params.geoLocation || geoLocation,
        uid: getUID,
      });

      let imgSrc;

      // const covidScore = data.result.covidScore;
      const isValidForRDT = data.result.isValidForRDT;
      const diagnoseResult = data.result.actions.diagnosisResult;
      const symptomID = data.result.symptomID;
      currentState = data.result.currentState;
      sessionId = data.sessionId;

      if (currentState !== 'initial') {
        localStorage.setItem('sesId', data.sessionId);
      }

      const title = data.result.messages.value.split('. ').map((text: string, key: any) => {
        if (key < data.result.messages.value.split('. ').length - 1) {
          return text + '.';
        } else {
          return text;
        }
      });

      const information = data.result.messages.explanation;

      if (currentState === 'askChiefComplaint') {
        imgSrc = complaint;
      }

      const options = (): Array<Record<string, any>> => {
        let buttonText: string | undefined;
        const state = 'initialUserInfo, askPrecondition, diagnosis';

        if (state.includes(currentState)) {
          buttonText = 'Lanjut';
        } else {
          buttonText = undefined;
        }

        if (data.result.actions.type === 'text') {
          return [
            {
              type: 'text',
              text: data.result.actions.value,
              variant: undefined,
              reply: {
                type: 'text',
                value: undefined,
                tag: undefined,
              },
            },
          ];
        } else if (currentState === 'diagnosis') {
          return [
            {
              type: 'button',
              text: buttonText,
              variant: 'primary',
              reply: {
                type: 'button',
                value: String('Lanjutkan'),
              },
            },
          ];
        } else if (data.result.actions.type === 'button') {
          return data.result.actions.value.map((item: any) => {
            return {
              type: data.result.actions.type,
              text: buttonText || item.label,
              variant: data.result.actions.value.length === 1 ? 'primary' : 'secondary',
              description: item.description || '-',
              reply: {
                type: data.result.actions.type,
                value: String(item.value),
                tag: item.tag,
              },
            };
          });
        } else if (data.result.actions.type === 'Preconditions') {
          return data.result.preconditions;
        } else {
          return [];
        }
      };

      let progress: number;

      if (currentState === 'preChiefComplaint') {
        progress = 100;
      } else if (data.progressBarPercentage === 20 && currentState === 'askInsurance') {
        progress = 57;
      } else if (data.progressBarPercentage === 24 && currentState === 'askInsurance') {
        progress = 80;
      } else {
        progress = data.progressBarPercentage;
      }

      const returnData = {
        sessionId: data.sessionId,
        progress: progress || 0,
        state: currentState,
        list: data.result.preconditions || undefined,
        title,
        imgSrc,
        options: options(),
        information,
        diagnoseResult,
        symptomID,
        isValidForRDT,
      };

      resolve(returnData);
    } catch (error) {
      reject(error);
    }
  });
}

export function getNewSession(): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const data: any = await postAPI(DIAGNOSTIC_API.CONVERSATION, {});
      resolve(data.sessionId);
    } catch (error) {
      reject(error);
    }
  });
}

// Cancel token
let token: any;

export const search = (url: string): Promise<unknown> => {
  return new Promise(async (resolve, reject) => {
    if (token) {
      // Cancel the previous request before making a new request
      token.cancel();
    }

    token = axios.CancelToken.source();

    try {
      const data: any = await getAPI(url);
      const result = data.data ? data.data : [];
      resolve(result);
    } catch (error) {
      if (!axios.isCancel(error)) {
        // Handle usual errors
        reject(error);
      }
    }
  });
};

export const refreshToken = (): Promise<unknown> =>
  axios.post(
    USER_API.REFRESH,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('loginToken')}`,
      },
    },
  );

let isAlreadyFetchingAccessToken = false;
let isAlreadyReturnGlobalError = false;
let subscribers: Array<AxiosRequestConfig> = [];

function onAccessTokenFetched(accessToken: string): void {
  subscribers = subscribers.filter((callback: any) => callback(accessToken));// eslint-disable-line
}

function addSubscriber(callback: any):void {// eslint-disable-line
  subscribers.push(callback); // add request queue
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Do something before request is sent
    const tmp = config; // reassigment lint
    const token = localStorage.getItem('loginToken');
    if (token) tmp.headers.Authorization = `Bearer ${token}`;
    return tmp;
  },
  error => Promise.reject(error),
);

const bypassRefresh = (originalRequest: AxiosRequestConfig): boolean | undefined => {
  return (
    originalRequest.url === USER_API.REFRESH ||
    originalRequest.url === USER_API.LOGIN ||
    originalRequest.method === 'delete' ||
    originalRequest.url?.includes('v2/partner/') ||
    originalRequest.url?.includes('/users/password')
  );
};

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {// eslint-disable-line
    if (!error || !error.response) {
      if (!isAlreadyReturnGlobalError) {
        isAlreadyReturnGlobalError = true;
        setTimeout(() => {
          isAlreadyReturnGlobalError = false;
        }, 5000);
      }
    }

    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (
      status === 401 &&
      originalRequest.url === USER_API.INFO &&
      error.response &&
      error.response.data &&
      error.response.data.type === 'InvalidClientLoginException'
    ) {
      logOut();
      window.location.replace('/');
    }
    if (status === 401 && !bypassRefresh(originalRequest)) {
      // console.log("try reauth");
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;

        // console.log("reauth processing");
        refreshToken().then((response: any): void => {
          isAlreadyFetchingAccessToken = false;

          const newTokenBearer = response.headers.authorization;
          const newAccessToken = newTokenBearer.split(' ')[1];
          localStorage.setItem('loginToken', newAccessToken);
          axios.defaults.headers.common.Authorization = newTokenBearer;
          originalRequest.headers.Authorization = newTokenBearer;

          // console.log("reauth success");
          onAccessTokenFetched(newAccessToken);
        });
      }

      const retryOriginalRequest = new Promise(resolve => {
        addSubscriber((accessToken: string) => {
          // console.log("try request again");
          localStorage.setItem('loginToken', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          resolve(axios(originalRequest));
        });
      });
      return retryOriginalRequest;
    }
    if (status === 401 && originalRequest.url === USER_API.REFRESH) {
      logOut();
      window.location.replace('/login');
    }

    return Promise.reject(error);
  },
);
