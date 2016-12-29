import {authRequest} from "./authRequest";

export function fetchEventDetails(eventId) {
  return authRequest({
    query: `query ($id:String!) {
    event(id:$id) {
      id
      category
      from
      to
      url
      title
      description
      image
      cost
      telephone
      venue
      venueCategory
    }
  }`,
    variables: {
      id: eventId
    }
  })
}

export function fetchEvents(clue, date, category, pageSize, nextPage) {

  const query = `query ($start:Int!, $limit: Int!, $date: Date, $clue: String, $category: [Category!]) {
    events(start: $start, limit: $limit, date: $date, clue: $clue, category: $category) {
      total
      items {
        id
        from
        to
        title
        image
        venue
      }
    }
  }`;

  const variables = {
    start: pageSize * nextPage,
    limit: pageSize,
    date: date.format('YYYY-MM-DD[T]HH:mm:ss'),
  };

  if (clue) {
    variables.clue = clue
  }

  if (category.length > 0) {
    variables.category = category.map(c => c.toUpperCase());
  }

  return authRequest({
    query: query,
    variables: variables,
  })
}




