export default ({ env }) => ({
  graphql: {
    config: {
      endpoint: '/graphql',
      landingPage: env('NODE_ENV') !== 'production',
      depthLimit: 7,
      defaultLimit: 25,
      maxLimit: 100,
    },
  },
});
