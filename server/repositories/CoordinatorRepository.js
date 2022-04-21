const BaseRepository = require('./BaseRepository');

class CoordinatorRepository extends BaseRepository {
  constructor(session) {
    super('coordinator', session);
    this._tableName = 'coordinator';
    this._session = session;
  }
}

module.exports = CoordinatorRepository;
