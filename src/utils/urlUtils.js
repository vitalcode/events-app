const pageSize = 10;

let from = 0;
let total = 0;

export function buildAllEventsUrl() {
  if (!total || from < total) {
    const url = `http://192.168.59.1:9200/lisenok/_search?from=${from}&size=${pageSize}&sort=from:asc`;
    console.log('url', url);
    from += pageSize;
    return url;
  }
  return null;
}

export function updateTotal(json) {
  total = json.hits.total;
  console.log('updateTotal', total);
}
