const Session = require('../database/Session');
const Agreement = require('../models/Agreement');

class AgreementService {
  constructor() {
    this._session = new Session();
    this._agreement = new Agreement(this._session);
  }

  async createAgreement(agreementObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._agreement.createAgreement(agreementObject);
      await this._session.commitTransaction();

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async getAgreements(filter, limitOptions) {
    return this._agreement.getAgreements(filter, limitOptions);
  }

  async getAgreementsCount(filter) {
    return this._agreement.getAgreementsCount(filter);
  }

  async getAgreementById(agreementId) {
    return this._agreement.getAgreementById(agreementId);
  }

  async updateAgreement(agreementObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._agreement.updateAgreement(agreementObject);
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

module.exports = AgreementService;
