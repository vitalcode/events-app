//import {Config} from './../config'
import Config from 'react-native-config'

// const pageSize = 10;
//
// let from = 0;
// let total = 0;

export function buildAllEventsUrl(clue, date, category, refresh, total, pageSize, nextPage) {

  let from = pageSize * nextPage;
  if (refresh) {
    from = 0;
  }

  //if (!total || from < total) {
  const url = `http://${Config.host}:${Config.port}/${Config.index}/_search?from=${from}&size=${pageSize}`;
  console.log('url', url);
  //from += pageSize;


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

  if (category !== 'all') {
    mustQuery.push({
      term: {
        category: category
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
        order: "asc",
        mode: "min"
      }
    }
  };

  console.log('query', query, JSON.stringify(query));

  return fetch(url, {
    method: "POST",
    body: JSON.stringify(query)
  });
  //}
}

// export function updateTotal(json) {
//   total = json.hits.total;
//   console.log('updateTotal', total);
// }

