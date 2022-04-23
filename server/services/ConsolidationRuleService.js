const Session = require('../database/Session');
const ConsolidationRule = require('../models/ConsolidationRule');

class ConsolidationRuleService {
  constructor() {
    this._session = new Session();
    this._consolidationRule = new ConsolidationRule(this._session);
  }

  async createConsolidationRule(consolidationRuleObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._consolidationRule.createConsolidationRule(
        consolidationRuleObject,
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

  async getConsolidationRules(filter, limitOptions) {
    return this._consolidationRule.getConsolidationRules(filter, limitOptions);
  }

  async getConsolidationRulesCount(filter) {
    return this._consolidationRule.getConsolidationRulesCount(filter);
  }

  async getConsolidationRuleById(consolidationRuleId) {
    return this._consolidationRule.getConsolidationRuleById(
      consolidationRuleId,
    );
  }

  async updateConsolidationRule(consolidationRuleObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._consolidationRule.updateConsolidationRule(
        consolidationRuleObject,
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

module.exports = ConsolidationRuleService;
