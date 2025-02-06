export const routes = [
  {
    id: 'get-primary-email', // id of the route
    url: '/v2/self', // url in path-to-regexp format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        type: 'json', // variant type
        options: {
          status: 200,
          body: {
            email: 'foo@example.com',
            emailVerified: true,
          },
        },
      },
    ],
  },
  {
    id: 'get-secondary-email', // id of the route
    url: '/v2/self/emails', // url in path-to-regexp format
    method: 'GET', // HTTP method
    variants: [
      {
        id: 'success', // id of the variant
        type: 'json', // variant type
        options: {
          status: 200,
          body: [],
        },
      },
    ],
  },
];

export const collections = [
  {
    id: 'base', // collection id
    routes: ['get-primary-email:success', 'get-secondary-email:success'], // collection routes
  },
];
