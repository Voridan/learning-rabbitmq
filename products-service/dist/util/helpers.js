"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSSE = void 0;
const cache_1 = require("./cache");
const setupSSE = (res, clientId) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.on('close', () => {
        delete cache_1.cache.orders[clientId];
        res.end();
    });
};
exports.setupSSE = setupSSE;
