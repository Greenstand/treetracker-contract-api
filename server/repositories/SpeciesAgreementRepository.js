const BaseRepository = require('./BaseRepository');

class SpeciesAgreementRepository extends BaseRepository {
  constructor(session) {
    super('species_agreement', session);
    this._session = session;
    this._tableName = 'species_agreement';
  }
}

module.exports = SpeciesAgreementRepository;
