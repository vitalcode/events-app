import {Config} from './../Config'

const pageSize = 10;

let from = 0;
let total = 0;

export function buildAllEventsUrl(clue, refresh) {

  if (refresh) {
    from = 0;
  }

  if (!total || from < total) {
    const url = `http://${Config.host}:9200/lisenok/_search?from=${from}&size=${pageSize}&sort=from:asc`;
    console.log('url', url);
    from += pageSize;

    //clue = 'astronauts';

    if (clue) {
      return fetch(url, {
        method: "POST",
        body: `{
        "query": {
          "multi_match": {
            "query": "${clue}",
            "fields": [
              "description"
            ],
            "operator":   "and"
          }
        }
      }`
      })
    }
    return fetch(url, {
      method: "POST"
    })
  }
}

export function updateTotal(json) {
  total = json.hits.total;
  console.log('updateTotal', total);
}

