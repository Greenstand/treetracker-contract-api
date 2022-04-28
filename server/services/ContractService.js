const Session = require('../infra/database/Session');
const Contract = require('../models/Contract');

class ContractService {
  constructor() {
    this._session = new Session();
    this._contract = new Contract(this._session);
  }

  async createContract(contractObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._contract.createContract(contractObject);
      await this._session.commitTransaction();

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async getContracts(filter, limitOptions) {
    return this._contract.getContracts(filter, limitOptions);
  }

  async getContractsCount(filter) {
    return this._contract.getContractsCount(filter);
  }

  async getContractById(contractId) {
    return this._contract.getContractById(contractId);
  }

  async updateContract(contractObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._contract.updateContract(contractObject);
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

module.exports = ContractService;
