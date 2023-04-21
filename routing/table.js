const appRoot = require('app-root-path')['path'];

const path = require('path'),
  table = path.join(appRoot, "public", 'table.ejs');

const tableR = (table_service, render) => {
  return (fastify, _, done) => {


    fastify.get('/multi/:id', async (request, reply) => {
      if (!request.session.authenticated) {
        return reply.redirect('/')
      }
      
      let tableid = request.params.id
      let userid = request.session.userid
      let obj = { tableid: tableid, userid: userid }
      await table_service.insert(obj)
      let xs = await  table_service.find_by_table(tableid)
     
      let tableobj = await table_service.find_table_by_id(tableid)
      
      let view = await render.render(table, request, {table:tableobj.tablename,users:xs})


      return reply.code(200).type('text/html').send(view)
    })
    done();
  }
};

module.exports = { tableR }