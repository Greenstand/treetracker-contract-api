const BaseRepository = require('./BaseRepository');

class ContractDocumentRepository extends BaseRepository {
  constructor(session) {
    super('contract_document', session);
    this._tableName = 'contract_document';
    this._session = session;
  }
}

module.exports = ContractDocumentRepository;
