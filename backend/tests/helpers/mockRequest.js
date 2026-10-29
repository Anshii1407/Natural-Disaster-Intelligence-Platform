import { EventEmitter } from 'node:events';

/**
 * Dispatch an in-memory HTTP request directly to the Express application
 * without opening network sockets.
 *
 * @param {Function} app - Express app
 * @param {Object} options - { method, url, headers, body }
 * @returns {Promise<{ status: number, body: any, headers: Object }>}
 */
export const request = (app, { method = 'GET', url = '/', headers = {}, body = null } = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const req = new EventEmitter();
      req.method = method.toUpperCase();
      req.url = url;
      req.originalUrl = url;
      req.headers = {};

      // Normalize headers to lowercase
      for (const [k, v] of Object.entries(headers)) {
        req.headers[k.toLowerCase()] = v;
      }

      req.ip = req.headers['x-forwarded-for'] || '127.0.0.1';
      req.socket = { remoteAddress: req.ip };

      if (body !== null) {
        req.body = body;
        if (!req.headers['content-type']) {
          req.headers['content-type'] = 'application/json';
        }
      } else {
        req.body = {};
      }

      const resHeaders = {};
      let statusCode = 200;
      let settled = false;

      const res = new EventEmitter();
      res.statusCode = 200;

      res.getHeader = (name) => resHeaders[name.toLowerCase()];
      res.setHeader = (name, value) => {
        resHeaders[name.toLowerCase()] = value;
      };
      res.hasHeader = (name) => name.toLowerCase() in resHeaders;
      res.removeHeader = (name) => {
        delete resHeaders[name.toLowerCase()];
      };

      res.status = (code) => {
        statusCode = code;
        res.statusCode = code;
        return res;
      };

      const finish = (responseBody) => {
        if (!settled) {
          settled = true;
          resolve({
            status: statusCode,
            body: responseBody,
            headers: resHeaders,
          });
        }
      };

      res.json = (data) => {
        finish(data);
        return res;
      };

      res.send = (data) => {
        finish(data);
        return res;
      };

      res.end = (data) => {
        finish(data);
        return res;
      };

      app.handle(req, res);
    } catch (err) {
      reject(err);
    }
  });
};

export default request;
