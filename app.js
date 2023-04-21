
const fs = require('fs'),
  path = require('path');
const knex = require('knex')({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: "./mydb.sqlite"
  }
});
const { Render } = require('./render')
const { signupR } = require('./routing/signup')
const { loginR } = require('./routing/login')
const { singleR } = require('./routing/single')
const { statsR } = require('./routing/stats')
const { tableR } = require('./routing/table')
const { UserService } = require('./services/userservice')
const { StatService } = require('./services/statservice')
const { TableService } = require('./services/tableservice')
const fastifySession = require('fastify-session')
const fastifyCookie = require('fastify-cookie')
const css = path.join(__dirname, "public", 'app.css'),
  //main = path.join(__dirname, "public", 'main.js');
  index = path.join(__dirname, "public", 'index.ejs'),
  home = path.join(__dirname, "public", 'home.ejs'),
  single = path.join(__dirname, "public", 'single.ejs'),
  table = path.join(__dirname, "public", 'table.ejs')
multi = path.join(__dirname, "public", 'multi.ejs')



const querystring = require('querystring')

const fastify = require('fastify')({
  loging: true,
  querystringParser: str => querystring.parse(str.toLowerCase())
})
let user_service = new UserService(knex)
let stat_service = new StatService(knex)
let table_service = new TableService(knex)
let render = new Render(Render)

fastify.get('/', async (request, reply) => {

  let content = await render.render(index, request,
    {
    })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/home', async (request, reply) => {
  let content = await render.render(home, request,
    {
    })
  return reply.code(200).type('text/html').send(content)
})
let newtablebody = {
  schema: {
      body: {
          type: 'object',
          properties: {
              tablename: {
                  type: 'string'
              },

          },
          required: ['tablename']
      }

  }
}
fastify.post('/newtable',newtablebody, async (request, reply) => {
  
  if (!request.session.authenticated) {
    return reply.redirect('/')
  } 
  let tablename = request.body.tablename
  let id = await table_service.add(tablename)
  
  return reply.code(200).type('application/json').send({id})
})
fastify.get('/table', async (request, reply) => {
  if (!request.session.authenticated) {
    return reply.redirect('/')
  }
  let tables = await table_service.result()
  let content = await render.render(table, request,
    {tables
    })
  return reply.code(200).type('text/html').send(content)
})

fastify.get('/single', async (request, reply) => {
  if (!request.session.authenticated) {
    return reply.redirect('/')
  }
  let content = await render.render(single, request,
    {
    })
  return reply.code(200).type('text/html').send(content)
})
fastify.get('/multi', async (request, reply) => {
  if (!request.session.authenticated) {
    return reply.redirect('/')
  }
  let tables = await table_service.result()
  let content = await render.render(multi, request,
    {
      tables
    })
  return reply.code(200).type('text/html').send(content)
})


fastify.get('/app.css', async (request, reply) => {
  let data = fs.readFileSync(css, { encoding: "utf-8" })
  return reply.code(200).type('application/css').send(data)
})
//fastify.get('/main.js', async (request, reply) => {
// let data = fs.readFileSync(main, { encoding: "utf-8" })
//  return reply.code(200).type('application/javascript').send(data)
//})
let jointable = tableR(table_service,render)
let signup = signupR(user_service, render)
let login = loginR(user_service, render)
let stats = statsR(stat_service, render)
fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  cookieName: 'sessionId',
  secret: 'a secret with minimum length of 32 characters',
  cookie: { secure: false },
  expires: 1800000
})
fastify.register(jointable)
fastify.register(signup)
fastify.register(login)
fastify.register(singleR(stat_service))
fastify.register(stats)




const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()