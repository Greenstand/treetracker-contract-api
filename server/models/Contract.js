const ContractRepository = require('../repositories/ContractRepository');
const { CONTRACT_STATUS } = require('../utils/enums');

class Contract {
  constructor(session) {
    this._contractRepository = new ContractRepository(session);
  }

  static Contract({
    id,
    agreement_id,
    worker_id,
    status,
    notes,
    created_at,
    updated_at,
    signed_at,
    closed_at,
    listed,
  }) {
    return Object.freeze({
      id,
      agreement_id,
      worker_id,
      status,
      notes,
      created_at,
      updated_at,
      signed_at,
      closed_at,
      listed,
    });
  }

  _response(contractObject) {
    return this.constructor.Contract(contractObject);
  }

  async createContract(contractObject) {
    const createdObject = await this._contractRepository.create(contractObject);
    return this._response(createdObject);
  }

  async getContracts(filter, limitOptions) {
    const contracts = await this._contractRepository.getByFilter(
      filter,
      limitOptions,
    );

    return contracts.map((a) => this._response(a));
  }

  async getContractsCount(filter) {
    return this._contractRepository.countByFilter(filter);
  }

  async getContractById(contractId) {
    const contract = await this._contractRepository.getById(contractId);
    // resource not found handled by the handler
    return contract ? this._response(contract) : contract;
  }

  async updateContract(contractObject) {
    const modifiedcontractObject = {
      ...contractObject,
      ...(contractObject.status === CONTRACT_STATUS.signed && {
        signed_at: new Date().toISOString(),
      }),
      ...((contractObject.status === CONTRACT_STATUS.completed ||
        contractObject.status === CONTRACT_STATUS.cancelled) && {
        closed_at: new Date().toISOString(),
      }),
    };

    const updatedObject = await this._contractRepository.update(
      modifiedcontractObject,
    );
    return this._response(updatedObject);
  }
}

module.exports = Contract;
