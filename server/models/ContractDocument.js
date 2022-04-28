const ContractDocumentRepository = require('../repositories/ContractDocumentRepository');

class ContractDocument {
  constructor(session) {
    this._contractDocumentRepository = new ContractDocumentRepository(session);
  }

  static ContractDocument({
    id,
    contract_id,
    document_id,
    created_at,
    listed,
  }) {
    return Object.freeze({ id, contract_id, document_id, created_at, listed });
  }

  _response(contractDocumentObject) {
    return this.constructor.ContractDocument(contractDocumentObject);
  }

  async createContractDocument(contractDocumentObject) {
    const createdObject = await this._contractDocumentRepository.create(
      contractDocumentObject,
    );
    return this._response(createdObject);
  }

  async getContractDocuments(filter, limitOptions) {
    const contractDocuments =
      await this._contractDocumentRepository.getByFilter(
        { listed: true, ...filter },
        limitOptions,
      );

    return contractDocuments.map((c) => this._response(c));
  }

  async getContractDocumentsCount(filter) {
    return this._contractDocumentRepository.countByFilter({
      listed: true,
      ...filter,
    });
  }

  async getContractDocumentById(contractDocumentId) {
    const contractDocument = await this._contractDocumentRepository.getById(
      contractDocumentId,
    );
    // resource not found handled by the handler
    return contractDocument
      ? this._response(contractDocument)
      : contractDocument;
  }

  async updateContractDocument(contractDocumentObject) {
    const updatedObject = await this._contractDocumentRepository.update(
      contractDocumentObject,
    );
    return this._response(updatedObject);
  }
}

module.exports = ContractDocument;
