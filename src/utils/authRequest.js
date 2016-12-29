import Config from "react-native-config";
import Jwt from "./jwt";

const graphqlUrl = `${Config.url}/graphql`;
const user = Config.user;
const password = Config.password;

export async function authRequest(graphQuery) {

  const response = await graphRequest(graphQuery);

  if (!response.errors) {
    return response;
  }

  await login(user, password);
  return graphRequest(graphQuery);
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
      console.log("TOKEN", token);
      Jwt.set(token);
      return token;
    });
}

function graphRequest(graphQuery) {
  const requestBody = JSON.stringify(graphQuery);
  console.log('graphRequest query: ', graphQuery, requestBody);
  return fetch(graphqlUrl, {
    method: "POST",
    body: requestBody,
    headers: new Headers({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${Jwt.get()}`
    })
  }).then(r => r.json());
}
