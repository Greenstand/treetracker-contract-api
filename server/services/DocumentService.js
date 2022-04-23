const Session = require('../database/Session');
const Document = require('../models/Document');

class DocumentService {
  constructor() {
    this._session = new Session();
    this._document = new Document(this._session);
  }

  async createDocument(documentObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._document.createDocument(documentObject);
      await this._session.commitTransaction();

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async getDocuments(filter, limitOptions) {
    return this._document.getDocuments(filter, limitOptions);
  }

  async getDocumentsCount(filter) {
    return this._document.getDocumentsCount(filter);
  }

  async getDocumentById(documentId) {
    return this._document.getDocumentById(documentId);
  }

  async updateDocument(documentObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._document.updateDocument(documentObject);
      await this._session.commitTransaction();

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }
}

module.exports = DocumentService;
