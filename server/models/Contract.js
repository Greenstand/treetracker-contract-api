const Joi = require('joi');
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
      { listed: true, ...filter },
      limitOptions,
    );

    return contracts.map((c) => this._response(c));
  }

  async getContractsCount(filter) {
    return this._contractRepository.countByFilter({ listed: true, ...filter });
  }

  async getContractById(contractId) {
    const contract = await this._contractRepository.getById(contractId);
    // resource not found handled by the handler
    return contract ? this._response(contract) : contract;
  }

  async updateContract(contractObject) {
    const contract = await this.getContractById(contractObject.id);

    const archiveSchema = Joi.object({
      id: Joi.string().uuid().required(),
      listed: Joi.boolean(),
    });

    switch (contract.status) {
      case 'unsigned': {
        await Joi.object({
          id: Joi.string().uuid().required(),
          status: Joi.string().valid(
            CONTRACT_STATUS.aborted,
            CONTRACT_STATUS.signed,
          ),
          listed: Joi.boolean().when('status', {
            is: CONTRACT_STATUS.signed,
            then: Joi.forbidden(),
          }),
        })
          .unknown(true)
          .validateAsync(contractObject, {
            abortEarly: true,
            messages: {
              '*': 'unsigned contracts can only be signed or aborted and cannot be archived when set to "signed"',
            },
          });

        break;
      }

      case CONTRACT_STATUS.signed: {
        await Joi.object({
          id: Joi.string().uuid().required(),
          status: Joi.string().valid(
            CONTRACT_STATUS.completed,
            CONTRACT_STATUS.cancelled,
          ),
        })
          .unknown(false)
          .validateAsync(contractObject, {
            abortEarly: true,
            messages: {
              '*': 'Signed contracts cannot be updated except setting the status to "completed" or "cancelled"',
            },
          });
        break;
      }

      case CONTRACT_STATUS.aborted: {
        await archiveSchema.unknown(false).validateAsync(contractObject, {
          abortEarly: true,
          messages: {
            '*': 'Aborted contracts can only be archived',
          },
        });
        break;
      }

      case CONTRACT_STATUS.completed: {
        await archiveSchema.unknown(false).validateAsync(contractObject, {
          abortEarly: true,
          messages: {
            '*': 'Completed contracts can only be archived',
          },
        });
        break;
      }

      case CONTRACT_STATUS.cancelled: {
        await archiveSchema.unknown(false).validateAsync(contractObject, {
          abortEarly: true,
          messages: {
            '*': 'Cancelled contracts can only be archived',
          },
        });
        break;
      }

      default:
        break;
    }

    const modifiedcontractObject = {
      ...contractObject,
      ...(contractObject.status === CONTRACT_STATUS.signed && {
        signed_at: new Date().toISOString(),
      }),
      ...([
        CONTRACT_STATUS.completed,
        CONTRACT_STATUS.cancelled,
        CONTRACT_STATUS.aborted,
      ].includes(contractObject.status) && {
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
