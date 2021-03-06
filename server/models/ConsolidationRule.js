const ConsolidationRuleRepository = require('../repositories/ConsolidationRuleRepository');

class ConsolidationRule {
  constructor(session) {
    this._consolidationRuleRepository = new ConsolidationRuleRepository(
      session,
    );
  }

  static ConsolidationRule({
    id,
    owner_id,
    name,
    lambda,
    parameters,
    created_at,
    listed,
  }) {
    return Object.freeze({
      id,
      owner_id,
      name,
      lambda,
      parameters,
      created_at,
      listed,
    });
  }

  _response(consolidationRuleObject) {
    return this.constructor.ConsolidationRule(consolidationRuleObject);
  }

  async createConsolidationRule(consolidationRuleObject) {
    const createdObject = await this._consolidationRuleRepository.create(
      consolidationRuleObject,
    );
    return this._response(createdObject);
  }

  async getConsolidationRules(filter, limitOptions) {
    const consolidationRules =
      await this._consolidationRuleRepository.getByFilter(
        { listed: true, ...filter },
        limitOptions,
      );

    return consolidationRules.map((c) => this._response(c));
  }

  async getConsolidationRulesCount(filter) {
    return this._consolidationRuleRepository.countByFilter({
      listed: true,
      ...filter,
    });
  }

  async getConsolidationRuleById(consolidationRuleId) {
    const consolidationRule = await this._consolidationRuleRepository.getById(
      consolidationRuleId,
    );
    // resource not found handled by the handler
    return consolidationRule
      ? this._response(consolidationRule)
      : consolidationRule;
  }

  async updateConsolidationRule(consolidationRuleObject) {
    const updatedObject = await this._consolidationRuleRepository.update(
      consolidationRuleObject,
    );
    return this._response(updatedObject);
  }
}

module.exports = ConsolidationRule;
