const fs = require('fs');
const { v4: uuid } = require('uuid');
const Session = require('../infra/database/Session');
const Document = require('../models/Document');
const { uploadCsv } = require('./S3Service');

class DocumentService {
  constructor() {
    this._session = new Session();
    this._document = new Document(this._session);
  }

  async createDocument(documentObject, file) {
    try {
      const key = `contract_document/${new Date().toISOString()}_${
        documentObject.name
      }_${uuid()}.csv`;
      const fileBuffer = await fs.promises.readFile(file.path);
      const uploadResult = await uploadCsv(fileBuffer, key);

      await this._session.beginTransaction();
      const result = await this._document.createDocument({
        ...documentObject,
        hardcopy_url: uploadResult.Location,
      });
      await this._session.commitTransaction();

      // delete temp file
      await fs.promises.unlink(file.path);

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      // delete temp file
      await fs.promises.unlink(file.path);
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
