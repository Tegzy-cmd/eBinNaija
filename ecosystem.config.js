module.exports = {
  apps: [
    {
      name: 'ewaste-api',
      script: './dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
