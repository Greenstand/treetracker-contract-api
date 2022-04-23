const CoordinatorRepository = require('../repositories/CoordinatorRepository');

class Coordinator {
  constructor(session) {
    this._coordinatorRepository = new CoordinatorRepository(session);
  }

  static Coordinator({
    id,
    stakeholder_id,
    coordinator_team_id,
    coordinator_id,
    role,
    created_at,
    updated_at,
    active,
  }) {
    return Object.freeze({
      id,
      stakeholder_id,
      coordinator_team_id,
      coordinator_id,
      role,
      created_at,
      updated_at,
      active,
    });
  }

  _response(coordinatorObject) {
    return this.constructor.Coordinator(coordinatorObject);
  }

  async createCoordinator(coordinatorObject) {
    const createdObject = await this._coordinatorRepository.create(
      coordinatorObject,
    );
    return this._response(createdObject);
  }

  async getCoordinators(filter, limitOptions) {
    const coordinators = await this._coordinatorRepository.getByFilter(
      filter,
      limitOptions,
    );

    return coordinators.map((c) => this._response(c));
  }

  async getCoordinatorsCount(filter) {
    return this._coordinatorRepository.countByFilter(filter);
  }

  async getCoordinatorById(coordinatorId) {
    const coordinator = await this._coordinatorRepository.getById(
      coordinatorId,
    );
    // resource not found handled by the handler
    return coordinator ? this._response(coordinator) : coordinator;
  }

  async updateCoordinator(coordinatorObject) {
    const updatedObject = await this._coordinatorRepository.update(
      coordinatorObject,
    );

    return this._response(updatedObject);
  }
}

module.exports = Coordinator;
