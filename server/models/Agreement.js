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
      filter,
      limitOptions,
    );

    return agreements.map((a) => this._response(a));
  }

  async getAgreementsCount(filter) {
    return this._agreementRepository.countByFilter(filter);
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
      ...(agreementObject.status === AGREEMENT_STATUS.closed && {
        closed_at: new Date().toISOString(),
      }),
    };

    // check to see if agreement is open
    const agreement = await this.getAgreementById(agreementObject.id);
    if (agreement.status === AGREEMENT_STATUS.open) {
      await Joi.object({
        id: Joi.string().uuid().required(),
        status: Joi.string().valid(AGREEMENT_STATUS.closed),
        listed: Joi.boolean(),
      })
        .unknown(false)
        .validateAsync(agreementObject, {
          abortEarly: true,
          messages: {
            '*': 'For open agreements, its status can either be set to close or its listed flag updated',
          },
        });

      const updatedObject = await this._agreementRepository.update(
        modifiedAgreementObject,
      );
      return this._response(updatedObject);
    }

    const updatedObject = await this._agreementRepository.update(
      modifiedAgreementObject,
    );
    return this._response(updatedObject);
  }
}

module.exports = Agreement;
