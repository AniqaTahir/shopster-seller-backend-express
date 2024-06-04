let blacklistedTokens = [];

const expireToken = (token) => {
  blacklistedTokens.push(token);
};

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.includes(token);
};

export { expireToken, isTokenBlacklisted };
