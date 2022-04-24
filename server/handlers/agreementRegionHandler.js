const Joi = require('joi');

const AgreementRegionService = require('../services/AgreementRegionService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');

const agreementRegionPostSchema = Joi.object({
  agreement_id: Joi.string().uuid().required(),
  region_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
}).unknown(false);

const agreementRegionGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  region_id: Joi.string().uuid(),
  agreement_id: Joi.string().uuid(),
  name: Joi.string(),
}).unknown(false);

const agreementRegionIdParamSchema = Joi.object({
  agreement_region_id: Joi.string().uuid(),
}).unknown(false);

const agreementRegionPatchSchema = Joi.object({
  open: Joi.boolean().valid(false),
}).unknown(false);

const agreementRegionPost = async function (req, res) {
  await agreementRegionPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const agreementRegionService = new AgreementRegionService();
  const result = await agreementRegionService.createAgreementRegion(req.body);

  res.status(201).send(result);
};

const agreementRegionGet = async function (req, res) {
  await agreementRegionGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const agreementRegionService = new AgreementRegionService();
  const agreementRegions = await agreementRegionService.getAgreementRegions(
    filter,
    limitOptions,
  );
  const count = await agreementRegionService.getAgreementRegionsCount(filter);

  const url = 'agreement_region';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    agreement_regions: agreementRegions,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const agreementRegionSingleGet = async function (req, res) {
  await agreementRegionIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const agreementRegionService = new AgreementRegionService();
  const agreementRegion = await agreementRegionService.getAgreementRegionById(
    req.params.agreement_region_id,
  );

  if (!agreementRegion) {
    throw new HttpError(
      404,
      `Agreement Region with id ${req.params.agreement_region_id} not found`,
    );
  }

  res.send(agreementRegion);
};

const agreementRegionPatch = async function (req, res) {
  await agreementRegionPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await agreementRegionIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const agreementRegionService = new AgreementRegionService();
  const result = await agreementRegionService.updateAgreementRegion({
    ...req.body,
    id: req.params.agreement_region_id,
  });

  res.send(result);
};

module.exports = {
  agreementRegionPost,
  agreementRegionGet,
  agreementRegionPatch,
  agreementRegionSingleGet,
};
