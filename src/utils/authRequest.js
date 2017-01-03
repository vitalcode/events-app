import Config from "react-native-config";
import Jwt from "./jwt";
import Logger from "./logger";
import Cache from "./cache";

const graphqlUrl = `${Config.url}/graphql`;
const user = Config.user;
const password = Config.password;
const logger = Logger('Request');

export async function authRequest(graphQuery) {
  const response = await graphRequest(graphQuery, true);
  const errors = response.errors;

  if (!errors) {
    return response;
  }

  if (isAuthError(errors)) {
    await login(user, password);
    return authRequest(graphQuery, true);
  }

  return Promise.reject();
}

function login(user, password) {
  const graphQuery = {
    query: `mutation ($user:String! $password:String!) {
      login(user:$user password: $password)
    }`,
    variables: {
      user: user,
      password: password
    }
  };

  return graphRequest(graphQuery)
    .then(response => {
      const token = response.data.login;
      logger.info('TOKEN', token);
      Jwt.set(token);
      return token;
    });
}

async function graphRequest(graphQuery, useCache) {
  logger.info('QUERY: ', graphQuery);
  const requestBody = JSON.stringify(graphQuery);
  let response;

  if (useCache) {
    response = await Cache.get(requestBody);
  }

  if (!response) {
    response = await fetch(graphqlUrl, {
      method: "POST",
      body: requestBody,
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': `Bearer ${Jwt.get()}`
      })
    }).then(r => r.json());

    if (useCache && !response.errors) {
      Cache.set(requestBody, response);
    }
  }

  return Promise.resolve(response);
}

function isAuthError(errors) {
  return !!errors.find(error => error.message === 'Invalid token')
}
