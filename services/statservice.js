
class StatService {
  constructor(knex) {
    this.knex = knex
  }
  async result(){
    let res = await this.knex('users').join('stats','stats.userid',
    '=','users.id').select('stats.id','stats.win','stats.lose',
     'users.username')
     console.log(res)
    return res
  }
  
  async upsert(userid, win, lose) {
    console.log(userid)
    let obj = { userid: userid, win: win, lose: lose }
    let row = await this.knex('stats').where({ userid: userid }).first()
    if (!row) {
      await this.knex.insert(obj).into('stats')
      return
    }
    row.win += win
    row.lose += lose
    await this.knex('stats').where({ userid: userid }).update(row)
    return

  }
  
}
module.exports = { StatService }