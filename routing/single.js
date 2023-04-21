const { Deck } = require('./util')
let userdeck = {}
let multideck = {}
const singleR = (stat_service) => {
  return (fastify, _, done) => {
    fastify.get('/newcard', async (request, reply) => {
      if(!request.session.authenticated){
        return  reply.redirect('/')
      }
      let key = request.session.userid
      let deck = userdeck[key] || new Deck()
      let obj = deck.getRandomCard()
      userdeck[key] = deck
      return reply.code(200).type('application/json').send(obj)
    })
    fastify.get('/finish', async (request, reply) => {
      if(!request.session.authenticated){
        return  reply.redirect('/')
      }
      let win = 0;
      let lose = 0
      let key = request.session.userid
      let deck = userdeck[key] || new Deck()
      let obj = deck.result()
      userdeck[key] = new Deck()
      if (obj.isWin) {
        win = 1
      } else {
        lose = 1
      }
      await stat_service.upsert(key, win, lose)
      return reply.code(200).type('application/json').send(obj)
    })
    
    fastify.get('/newcard/:table', async (request, reply) => {
      if(!request.session.authenticated){
        return  reply.redirect('/')
      }
      let key = request.params.table
      let deck = multideck[key] || new Deck()
      let obj = deck.getRandomCard()
      multideck[key] = deck
      return reply.code(200).type('application/json').send(obj)
    })
    fastify.get('/finish/:table', async (request, reply) => {
      if(!request.session.authenticated){
        return  reply.redirect('/')
      }
      let win = 0;
      let lose = 0
      let key = request.params.table
      let deck = multideck[key] || new Deck()
      let obj = deck.result()
      multideck[key] = new Deck()
      if (obj.isWin) {
        win = 1
      } else {
        lose = 1
      }
      await stat_service.upsert(key, win, lose)
      return reply.code(200).type('application/json').send(obj)
    })

    done();
  }

}
module.exports = { singleR }