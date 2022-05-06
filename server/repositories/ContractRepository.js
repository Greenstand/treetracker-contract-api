const BaseRepository = require('./BaseRepository');

class ContractRepository extends BaseRepository {
  constructor(session) {
    super('contract', session);
    this._tableName = 'contract';
    this._session = session;
  }
}

module.exports = ContractRepository;
