const DocumentRepository = require('../repositories/DocumentRepository');

class Document {
  constructor(session) {
    this._documentRepository = new DocumentRepository(session);
  }

  static Document({
    id,
    name,
    description,
    version,
    hardcopy_url,
    created_at,
    listed,
  }) {
    return Object.freeze({
      id,
      name,
      description,
      version,
      hardcopy_url,
      created_at,
      listed,
    });
  }

  _response(documentObject) {
    return this.constructor.Document(documentObject);
  }

  async createDocument(documentObject) {
    const createdObject = await this._documentRepository.create(documentObject);
    return this._response(createdObject);
  }

  async getDocuments(filter, limitOptions) {
    const documents = await this._documentRepository.getByFilter(
      filter,
      limitOptions,
    );

    return documents.map((d) => this._response(d));
  }

  async getDocumentsCount(filter) {
    return this._documentRepository.countByFilter(filter);
  }

  async getDocumentById(documentId) {
    const document = await this._documentRepository.getById(documentId);
    // resource not found handled by the handler
    return document ? this._response(document) : document;
  }

  async updateDocumentService(documentObject) {
    const updatedObject = await this._documentRepository.update(documentObject);
    return this._response(updatedObject);
  }
}

module.exports = Document;
