const { request } = require('http');

const appRoot = require('app-root-path')['path'];

const path = require('path'),
    stats = path.join(appRoot, "public", 'stats.ejs');


const statsR = (stat_service, render) => {
    return (fastify, _, done) => {

        fastify.get('/stats', async (request, reply) => {
            let key = request.session.userid
            
            let result = await stat_service.result(key)
            let st = await render.render(stats, request, { result })
            return reply.code(200).type('text/html').send(st)
        })


        done();
    }

};

module.exports = { statsR }
