const Joi = require('joi');
const AgreementRepository = require('../repositories/AgreementRepository');
const { AGREEMENT_STATUS } = require('../utils/enums');

class Agreement {
  constructor(session) {
    this._agreementRepository = new AgreementRepository(session);
  }

  static Agreement({
    id,
    type,
    owner_id,
    funder_id,
    growing_organization_id,
    coordination_team_id,
    species_agreement_id,
    consolidation_rule_id,
    name,
    description,
    capture_payment,
    capture_payment_currency,
    max_captures,
    status,
    created_at,
    updated_at,
    opened_at,
    closed_at,
    listed,
  }) {
    return Object.freeze({
      id,
      type,
      owner_id,
      funder_id,
      growing_organization_id,
      coordination_team_id,
      species_agreement_id,
      consolidation_rule_id,
      name,
      description,
      capture_payment,
      capture_payment_currency,
      max_captures,
      status,
      created_at,
      updated_at,
      opened_at,
      closed_at,
      listed,
    });
  }

  _response(agreementObject) {
    return this.constructor.Agreement(agreementObject);
  }

  async createAgreement(agreementObject) {
    const createdObject = await this._agreementRepository.create(
      agreementObject,
    );
    return this._response(createdObject);
  }

  async getAgreements(filter, limitOptions) {
    const agreements = await this._agreementRepository.getByFilter(
      { listed: true, ...filter },
      limitOptions,
    );

    return agreements.map((a) => this._response(a));
  }

  async getAgreementsCount(filter) {
    return this._agreementRepository.countByFilter({ listed: true, ...filter });
  }

  async getAgreementById(agreementId) {
    const agreement = await this._agreementRepository.getById(agreementId);
    // resource not found handled by the handler
    return agreement ? this._response(agreement) : agreement;
  }

  async updateAgreement(agreementObject) {
    const modifiedAgreementObject = {
      ...agreementObject,
      ...(agreementObject.status === AGREEMENT_STATUS.open && {
        opened_at: new Date().toISOString(),
      }),
      ...([AGREEMENT_STATUS.closed, AGREEMENT_STATUS.aborted].includes(
        agreementObject.status,
      ) && {
        closed_at: new Date().toISOString(),
      }),
    };

    // check to see if agreement is open
    const agreement = await this.getAgreementById(agreementObject.id);
    if (agreement.status === 'planning') {
      await Joi.object({
        id: Joi.string().uuid().required(),
        status: Joi.string().valid(
          AGREEMENT_STATUS.open,
          AGREEMENT_STATUS.aborted,
        ),
        listed: Joi.boolean().when('status', {
          is: AGREEMENT_STATUS.open,
          then: Joi.forbidden(),
        }),
      })
        .unknown(true)
        .validateAsync(agreementObject, {
          abortEarly: true,
          messages: {
            '*': 'agreements in planning state can only be opened or aborted and cannot be archived when set to "open"',
          },
        });
    } else if (agreement.status === AGREEMENT_STATUS.open) {
      await Joi.object({
        id: Joi.string().uuid().required(),
        status: Joi.string().valid(AGREEMENT_STATUS.closed),
        listed: Joi.boolean(),
      })
        .unknown(false)
        .validateAsync(agreementObject, {
          abortEarly: true,
          messages: {
            '*': 'For open agreements, its status can either be set to "closed" or its listed flag updated',
          },
        });
    } else {
      await Joi.object({
        id: Joi.string().uuid().required(),
        listed: Joi.boolean(),
      })
        .unknown(false)
        .validateAsync(agreementObject, {
          abortEarly: true,
          messages: {
            '*': 'Agreement can only be archived',
          },
        });
    }

    const updatedObject = await this._agreementRepository.update(
      modifiedAgreementObject,
    );
    return this._response(updatedObject);
  }
}

module.exports = Agreement;
