const config = {
  port: process.env.PORT || 5001,
  dbUri: process.env.DB_URI,
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;