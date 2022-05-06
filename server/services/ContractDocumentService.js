const Session = require('../infra/database/Session');
const ContractDocument = require('../models/ContractDocument');

class ContractDocumentService {
  constructor() {
    this._session = new Session();
    this._contractDocument = new ContractDocument(this._session);
  }

  async createContractDocument(contractDocumentObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._contractDocument.createContractDocument(
        contractDocumentObject,
      );
      await this._session.commitTransaction();

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async getContractDocuments(filter, limitOptions) {
    return this._contractDocument.getContractDocuments(filter, limitOptions);
  }

  async getContractDocumentsCount(filter) {
    return this._contractDocument.getContractDocumentsCount(filter);
  }

  async getContractDocumentById(contractDocumentId) {
    return this._contractDocument.getContractDocumentById(contractDocumentId);
  }

  async updateContractDocument(contractDocumentObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._contractDocument.updateContractDocument(
        contractDocumentObject,
      );
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

module.exports = ContractDocumentService;
