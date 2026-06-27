// const redisClient = {
//   get: async () => null,
//   set: async () => {},
//   del: async () => {},
// };

// module.exports = redisClient;
const otpStore = new Map();

const redisClient = {
  async set(key, value) {
    otpStore.set(key, value);
  },

  async get(key) {
    return otpStore.get(key);
  },

  async del(key) {
    otpStore.delete(key);
  },
};

module.exports = redisClient;