
class TableService {
  constructor(knex) {
    this.knex = knex
  }
  async result() {
    let res = await this.knex.select().from('tables')
    console.log(res)
    return res
  }
  async find_table_by_id(id){
    let result = await this.knex('tables').where({id:id}).first()
    return result;
  }
  async insert(obj) {
    
    let securety = await this.knex('connects').where(obj).first()
    if(!securety){
      await this.knex.insert(obj).into('connects')
      return
    }
  }
  async find_by_table(tableid){
     return await this.knex('users').join('connects','users.id', '=','connects.userid')
      .select('users.username','users.id', 'connects.tableid').where ({tableid:tableid}) 
     
  }
  async add(tablename) {
    let obj = { tablename: tablename }

    let result = await this.knex.insert(obj).returning('id').into('tables')
    return result
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
module.exports = { TableService }