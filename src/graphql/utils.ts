/* graphql configuration */
import { ApolloClient, fromPromise, InMemoryCache, createHttpLink, from } from '@apollo/client';
import axios from 'axios';
import { refreshToken } from '../api/api-utils';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

const processingRenewToken = async () => {
  try {
    const response: any = await refreshToken();
    const newTokenBearer = response.headers.authorization;
    const newAccessToken = newTokenBearer.split(' ')[1];
    axios.defaults.headers.common.Authorization = newTokenBearer;
    await localStorage.setItem('accessToken', newAccessToken);
    return newTokenBearer;
  } catch (error) {
    /* error refresh token */
    console.log(error);
    // throw Error(false);
    return false;
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }: any) => {
  console.log({
    graphQLErrors,
    networkError,
    operation,
    forward,
  });
  if (graphQLErrors) {
    for (let err = 0; err < graphQLErrors.length; err += 1) {
      switch (graphQLErrors[err].extensions.category) {
        case 'authentication':
          return fromPromise(processingRenewToken())
            .filter((value: any) => {
              console.log('In filter: ', value);
              return value;
            })
            .flatMap((newTokenBearer: any) => {
              console.log('In flat map:', operation);
              // retry the request, returning the new observable
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  Authorization: newTokenBearer,
                },
              });
              return forward(operation);
            });
        default:
          window.close();
      }
    }
  }
});

const httpLink = createHttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('loginToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const defaultClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default defaultClient;
