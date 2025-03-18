export default {
  nodeResolve: true,
  open: true,
  appIndex: 'demo/index.html',
  watch: true,
  rootDir: '.',
  preserveSymlinks: true,
  // Configure how modules are resolved
  moduleDirs: ['node_modules'],
  // Configure middleware for special handling of requests
  middleware: [
    // Log all requests for debugging
    function logRequests(context, next) {
      if (context.url.includes('worker')) {
        console.log('Worker request:', context.url);
      }
      return next();
    }
  ],
  // Configure plugins
  plugins: []
};
