const Session = require('../database/Session');
const AgreementRegion = require('../models/AgreementRegion');

class AgreementRegionService {
  constructor() {
    this._session = new Session();
    this._agreementRegion = new AgreementRegion(this._session);
  }

  async createAgreementRegion(agreementRegionObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._agreementRegion.createAgreementRegion(
        agreementRegionObject,
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

  async getAgreementRegions(filter, limitOptions) {
    return this._agreementRegion.getAgreementRegions(filter, limitOptions);
  }

  async getAgreementRegionsCount(filter) {
    return this._agreementRegion.getAgreementRegionsCount(filter);
  }

  async getAgreementRegionById(agreementId) {
    return this._agreementRegion.getAgreementRegionById(agreementId);
  }

  async updateAgreementRegion(agreementRegionObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._agreementRegion.updateAgreementRegion(
        agreementRegionObject,
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

module.exports = AgreementRegionService;
