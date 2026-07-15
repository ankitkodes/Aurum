// global controller error handler
export const asyncHander = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next).catch(next));
