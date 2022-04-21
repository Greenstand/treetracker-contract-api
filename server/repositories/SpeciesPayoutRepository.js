const BaseRepository = require('./BaseRepository');

class SpeciesAgreementRepository extends BaseRepository {
  constructor(session) {
    super('species_payout', session);
    this._tableName = 'species_payout';
    this._session = session;
  }
}

module.exports = SpeciesAgreementRepository;
