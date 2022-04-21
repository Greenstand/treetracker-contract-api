const SpeciesPayoutRepository = require('../repositories/SpeciesPayoutRepository');

class SpeciesPayout {
  constructor(session) {
    this._speciesPayoutRepository = new SpeciesPayoutRepository(session);
  }

  static SpeciesPayout({
    id,
    species_agreement_id,
    type,
    scientific_name,
    species_id,
    payment,
    payment_currency,
    created_at,
    closed_at,
    open,
  }) {
    return Object.freeze({
      id,
      species_agreement_id,
      type,
      scientific_name,
      species_id,
      payment,
      payment_currency,
      open,
      closed_at,
      created_at,
    });
  }

  _response(speciesPayoutObject) {
    return this.constructor.SpeciesPayout(speciesPayoutObject);
  }

  async createSpeciesPayout(speciesPayoutsObject) {
    const createdObject = await this._speciesPayoutRepository.create(
      speciesPayoutsObject,
    );
    return this._response(createdObject);
  }

  async getSpeciesPayouts(filter, limitOptions) {
    const speciesPayouts = await this._speciesPayoutRepository.getByFilter(
      filter,
      limitOptions,
    );

    return speciesPayouts.map((s) => this._response(s));
  }

  async getSpeciesPayoutsCount(filter) {
    return this._speciesPayoutRepository.countByFilter(filter);
  }

  async getSpeciesPayoutById(speciesPayoutId) {
    const speciesPayout = await this._speciesPayoutRepository.getById(
      speciesPayoutId,
    );
    // resource not found handled by the handler
    return speciesPayout ? this._response(speciesPayout) : speciesPayout;
  }

  async updateSpeciesPayoutService(speciesPayoutObject) {
    const updatedObject = await this._speciesPayoutRepository.update(
      speciesPayoutObject,
    );
    return this._response(updatedObject);
  }
}

module.exports = SpeciesPayout;
