const Session = require('../database/Session');
const Coordinator = require('../models/Coordinator');

class CoordinatorService {
  constructor() {
    this._session = new Session();
    this._coordinator = new Coordinator(this._session);
  }

  async createCoordinator(coordinatorObject) {
    try {
      await this._session.beginTransaction();
      const result = await this._coordinator.createCoordinator(
        coordinatorObject,
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

  async getCoordinators(filter, limitOptions) {
    return this._coordinator.getCoordinators(filter, limitOptions);
  }

  async getCoordinatorsCount(filter) {
    return this._coordinator.getCoordinatorsCount(filter);
  }

  async getCoordinatorById(coordinatorId) {
    return this._coordinator.getCoordinatorById(coordinatorId);
  }

  async updateCoordinatorService(requestObject) {
    return this._coordinator.updateCoordinatorService(requestObject);
  }
}

module.exports = CoordinatorService;
