import Config from "react-native-config";
import Jwt from "./jwt";
import Logger from "./logger";

const graphqlUrl = `${Config.url}/graphql`;
const user = Config.user;
const password = Config.password;
const logger = Logger('Request');

export async function authRequest(graphQuery) {
  const response = await graphRequest(graphQuery);

  const errors = response.errors;
  if (errors && isAuthError(errors)) {
    await login(user, password);
    return graphRequest(graphQuery);
  }

  return response;
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

function graphRequest(graphQuery) {
  logger.info('QUERY: ', graphQuery);
  return fetch(graphqlUrl, {
    method: "POST",
    body: JSON.stringify(graphQuery),
    headers: new Headers({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${Jwt.get()}`
    })
  }).then(r => r.json());
}

function isAuthError(errors) {
  return !!errors.find(error => error.message === 'Invalid token')
}
