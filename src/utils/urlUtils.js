import {Config} from './../config'

const pageSize = 10;

let from = 0;
let total = 0;

export function buildAllEventsUrl(clue, date, refresh) {

  if (refresh) {
    from = 0;
  }

  if (!total || from < total) {
    const url = `http://${Config.host}:9200/lisenok/_search?from=${from}&size=${pageSize}`;
    console.log('url', url);
    from += pageSize;


    const mustQuery = []

    if (date) {
      mustQuery.push({
        range: {
          from: {
            gte: date.toISOString()
          }
        }
      })
    }

    if (clue) {
      mustQuery.push({
        multi_match: {
          query: clue,
          fields: [
            "description"
          ],
          operator: "and"
        }
      })
    }

    const query = {
      query: {
        bool: {
          must: mustQuery
        }
      },
      sort: {
        from: {
          order: "asc"
        }
      }

    };

    console.log('query', query, JSON.stringify(query));

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(query)
    });

  }
}

export function updateTotal(json) {
  total = json.hits.total;
  console.log('updateTotal', total);
}

