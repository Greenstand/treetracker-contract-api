const BaseRepository = require('./BaseRepository');

class DocumentRepository extends BaseRepository {
  constructor(session) {
    super('document', session);
    this._tableName = 'document';
    this._session = session;
  }
}

module.exports = DocumentRepository;
