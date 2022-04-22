const BaseRepository = require('./BaseRepository');

class ConsolidationRuleRepository extends BaseRepository {
  constructor(session) {
    super('consolidation_rule', session);
    this._tableName = 'consolidation_rule';
    this._session = session;
  }
}

module.exports = ConsolidationRuleRepository;
