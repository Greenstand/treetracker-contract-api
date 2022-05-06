const BaseRepository = require('./BaseRepository');

class CoordinatorRepository extends BaseRepository {
  constructor(session) {
    super('coordinator', session);
    this._tableName = 'coordinator';
    this._session = session;
  }

  async getById(id) {
    const object = await this._session
      .getDB()
      .select()
      .table(this._tableName)
      .where({ id, active: true })
      .first();
    return object;
  }
}

module.exports = CoordinatorRepository;
