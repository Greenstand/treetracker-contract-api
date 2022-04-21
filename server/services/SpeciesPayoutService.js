const Session = require('../database/Session');
const SpeciesPayout = require('../models/SpeciesPayout');

class SpeciesPayoutService {
  constructor() {
    this._session = new Session();
    this._speciesPayout = new SpeciesPayout(this._session);
  }

  async createSpeciesPayout(speciesPayoutObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._speciesPayout.createSpeciesPayout(
        speciesPayoutObject,
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

  async getSpeciesPayouts(filter, limitOptions) {
    return this._speciesPayout.getSpeciesPayouts(filter, limitOptions);
  }

  async getSpeciesPayoutsCount(filter) {
    return this._speciesPayout.getSpeciesPayoutsCount(filter);
  }

  async getSpeciesPayoutById(speciesPayoutId) {
    return this._speciesPayout.getSpeciesPayoutById(speciesPayoutId);
  }

  async updateSpeciesPayoutService(speciesPayoutObject) {
    return this._speciesPayout.updateSpeciesPayoutService(speciesPayoutObject);
  }
}

module.exports = SpeciesPayoutService;
