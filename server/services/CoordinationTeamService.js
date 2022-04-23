const Session = require('../database/Session');
const CoordinationTeam = require('../models/CoordinationTeam');

class CoordinationTeamService {
  constructor() {
    this._session = new Session();
    this._coordinationTeam = new CoordinationTeam(this._session);
  }

  async createCoordinationTeam(coordinationTeamObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._coordinationTeam.createCoordinationTeam(
        coordinationTeamObject,
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

  async getCoordinationTeams(filter, limitOptions) {
    return this._coordinationTeam.getCoordinationTeams(filter, limitOptions);
  }

  async getCoordinationTeamsCount(filter) {
    return this._coordinationTeam.getCoordinationTeamsCount(filter);
  }

  async getCoordinationTeamById(coordinationTeamId) {
    return this._coordinationTeam.getCoordinationTeamById(coordinationTeamId);
  }

  async updateCoordinationTeam(coordinationTeamObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._coordinationTeam.updateCoordinationTeam(
        coordinationTeamObject,
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

module.exports = CoordinationTeamService;
