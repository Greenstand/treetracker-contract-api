const BaseRepository = require('./BaseRepository');

class AgreementRepository extends BaseRepository {
  constructor(session) {
    super('agreement', session);
    this._tableName = 'agreement';
    this._session = session;
  }
}

module.exports = AgreementRepository;
