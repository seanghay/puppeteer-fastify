import Fastify from "fastify";
import { createResponse } from './puppeteer.js'

const server = Fastify({});

server.get('/render', async (request, reply) => createResponse(request.query, reply));
server.post('/render', async (request, reply) => createResponse(request.body, reply));

await server.listen({
  port: 8080,
  host: '::'
})
