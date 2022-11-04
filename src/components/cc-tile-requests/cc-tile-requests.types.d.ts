type RequestsData = [
  number, // Start timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
  number, // End timestamp in milliseconds. Expected to be rounded to the hour of its respective TZ.
  number, // Number of request during this time window.
]
