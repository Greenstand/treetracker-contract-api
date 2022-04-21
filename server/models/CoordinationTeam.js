const CoordinationTeamRepository = require('../repositories/CoordinationTeamRepository');

class CoordinationTeam {
  constructor(session) {
    this._coordinationTeamRepository = new CoordinationTeamRepository(session);
  }

  static CoordinationTeam({
    id,
    owner_id,
    name,
    description,
    listed,
    created_at,
    updated_at,
  }) {
    return Object.freeze({
      id,
      owner_id,
      name,
      description,
      listed,
      created_at,
      updated_at,
    });
  }

  _response(coordinationTeamObject) {
    return this.constructor.CoordinationTeam(coordinationTeamObject);
  }

  async createCoordinationTeam(coordinationTeamObject) {
    const createdObject = await this._coordinationTeamRepository.create(
      coordinationTeamObject,
    );
    return this._response(createdObject);
  }

  async getCoordinationTeams(filter, limitOptions) {
    const coordinationTeams =
      await this._coordinationTeamRepository.getByFilter(filter, limitOptions);

    return coordinationTeams.map((c) => this._response(c));
  }

  async getCoordinationTeamsCount(filter) {
    return this._coordinationTeamRepository.countByFilter(filter);
  }

  async getCoordinationTeamById(coordinationTeamId) {
    const coordinationTeam = await this._coordinationTeamRepository.getById(
      coordinationTeamId,
    );
    // resource not found handled by the handler
    return coordinationTeam
      ? this._response(coordinationTeam)
      : coordinationTeam;
  }

  async updateCoordinationTeamService(requestObject) {
    const updatedObject = await this._coordinationTeamRepository.update(
      requestObject,
    );

    return this._response(updatedObject);
  }
}

module.exports = CoordinationTeam;
