const Session = require('../infra/database/Session');
const SpeciesAgreement = require('../models/SpeciesAgreement');

class SpeciesAgreementService {
  constructor() {
    this._session = new Session();
    this._speciesAgreement = new SpeciesAgreement(this._session);
  }

  async createSpeciesAgreement(speciesAgreementObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._speciesAgreement.createSpeciesAgreement(
        speciesAgreementObject,
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

  async getSpeciesAgreements(filter, limitOptions) {
    return this._speciesAgreement.getSpeciesAgreements(filter, limitOptions);
  }

  async getSpeciesAgreementsCount(filter) {
    return this._speciesAgreement.getSpeciesAgreementsCount(filter);
  }

  async getSpeciesAgreementById(speciesAgreementId) {
    return this._speciesAgreement.getSpeciesAgreementById(speciesAgreementId);
  }

  async updateSpeciesAgreement(speciesAgreementObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._speciesAgreement.updateSpeciesAgreement(
        speciesAgreementObject,
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
}

module.exports = SpeciesAgreementService;
