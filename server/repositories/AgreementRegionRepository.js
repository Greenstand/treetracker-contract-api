const BaseRepository = require('./BaseRepository');

class AgreementRegionRepository extends BaseRepository {
  constructor(session) {
    super('agreement_region', session);
    this._tableName = 'agreement_region';
    this._session = session;
  }
}

module.exports = AgreementRegionRepository;
