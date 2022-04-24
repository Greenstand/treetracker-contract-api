const AgreementRegionRepository = require('../repositories/AgreementRegionRepository');

class AgreementRegion {
  constructor(session) {
    this._agreementRegionRepository = new AgreementRegionRepository(session);
  }

  static AgreementRegion({
    id,
    agreement_id,
    region_id,
    name,
    created_at,
    closed_at,
    open,
  }) {
    return Object.freeze({
      id,
      agreement_id,
      region_id,
      name,
      created_at,
      closed_at,
      open,
    });
  }

  _response(agreementRegionObject) {
    return this.constructor.AgreementRegion(agreementRegionObject);
  }

  async createAgreementRegion(agreementRegionObject) {
    const createdObject = await this._agreementRegionRepository.create(
      agreementRegionObject,
    );
    return this._response(createdObject);
  }

  async getAgreementRegions(filter, limitOptions) {
    const agreementRegions = await this._agreementRegionRepository.getByFilter(
      filter,
      limitOptions,
    );

    return agreementRegions.map((a) => this._response(a));
  }

  async getAgreementRegionsCount(filter) {
    return this._agreementRegionRepository.countByFilter(filter);
  }

  async getAgreementRegionById(agreementRegionId) {
    const agreementRegion = await this._agreementRegionRepository.getById(
      agreementRegionId,
    );
    // resource not found handled by the handler
    return agreementRegion ? this._response(agreementRegion) : agreementRegion;
  }

  async updateAgreementRegion(agreementRegionObject) {
    const updatedObject = await this._agreementRegionRepository.update({
      ...agreementRegionObject,
      ...(agreementRegionObject.open === false && {
        closed_at: new Date().toISOString(),
      }),
    });
    return this._response(updatedObject);
  }
}

module.exports = AgreementRegion;
