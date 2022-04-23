const SpeciesAgreementRepository = require('../repositories/SpeciesAgreementRepository');

class SpeciesAgreement {
  constructor(session) {
    this._speciesAgreementRepository = new SpeciesAgreementRepository(session);
  }

  static SpeciesAgreement({
    id,
    owner_id,
    variable_species_payout,
    name,
    description,
    created_at,
    listed,
  }) {
    return Object.freeze({
      id,
      owner_id,
      variable_species_payout,
      name,
      description,
      created_at,
      listed,
    });
  }

  _response(speciesAgreementObject) {
    return this.constructor.SpeciesAgreement(speciesAgreementObject);
  }

  async createSpeciesAgreement(speciesAgreementsObject) {
    const createdObject = await this._speciesAgreementRepository.create(
      speciesAgreementsObject,
    );
    return this._response(createdObject);
  }

  async getSpeciesAgreements(filter, limitOptions) {
    const speciesAgreements =
      await this._speciesAgreementRepository.getByFilter(filter, limitOptions);

    return speciesAgreements.map((s) => this._response(s));
  }

  async getSpeciesAgreementsCount(filter) {
    return this._speciesAgreementRepository.countByFilter(filter);
  }

  async getSpeciesAgreementById(speciesAgreementId) {
    const speciesAgreement = await this._speciesAgreementRepository.getById(
      speciesAgreementId,
    );
    // resource not found handled by the handler
    return speciesAgreement
      ? this._response(speciesAgreement)
      : speciesAgreement;
  }

  async updateSpeciesAgreement(speciesAgreementObject) {
    const updatedObject = await this._speciesAgreementRepository.update(
      speciesAgreementObject,
    );
    return this._response(updatedObject);
  }
}

module.exports = SpeciesAgreement;
