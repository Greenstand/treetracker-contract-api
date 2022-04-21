const BaseRepository = require('./BaseRepository');

class CoordinationTeamRepository extends BaseRepository {
  constructor(session) {
    super('coordination_team', session);
    this._tableName = 'coordination_team';
    this._session = session;
  }
}

module.exports = CoordinationTeamRepository;
