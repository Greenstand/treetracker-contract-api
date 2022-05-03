const Joi = require('joi');

const AgreementService = require('../services/AgreementService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');
const {
  AGREEMENT_TYPE,
  AGREEMENT_STATUS,
  CURRENCY,
} = require('../utils/enums');

const agreementPostSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(AGREEMENT_TYPE))
    .required(),
  owner_id: Joi.string().uuid().required(),
  funder_id: Joi.string().uuid().required(),
  growing_organization_id: Joi.string().uuid(),
  coordination_team_id: Joi.string().uuid(),
  species_agreement_id: Joi.string().uuid(),
  consolidation_rule_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  capture_payment: Joi.number(),
  capture_payment_currency: Joi.string().valid(...Object.values(CURRENCY)),
  max_captures: Joi.number().integer(),
}).unknown(false);

const agreementGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  owner_id: Joi.string().uuid(),
  name: Joi.string(),
  listed: Joi.boolean(),
  consolidation_rule_id: Joi.string().uuid(),
}).unknown(false);

const agreementIdParamSchema = Joi.object({
  agreement_id: Joi.string().uuid(),
}).unknown(false);

const agreementPatchSchema = Joi.object({
  growing_organization_id: Joi.string().uuid(),
  coordination_team_id: Joi.string().uuid(),
  species_agreement_id: Joi.string().uuid(),
  description: Joi.string(),
  capture_payment: Joi.number(),
  capture_payment_currency: Joi.string().valid(...Object.values(CURRENCY)),
  max_captures: Joi.number().integer(),
  status: Joi.string().valid(...Object.values(AGREEMENT_STATUS)),
  listed: Joi.boolean(),
}).unknown(false);

const agreementPost = async function (req, res) {
  await agreementPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const body = { ...req.body };
  if (
    !body.species_agreement_id &&
    (!body.capture_payment || !body.capture_payment_currency)
  ) {
    throw new HttpError(
      422,
      'capture_payment and capture_payment_currency cannot be undefined if species_agreement_id is undefined',
    );
  }

  const agreementService = new AgreementService();
  const result = await agreementService.createAgreement(body);

  res.status(201).send(result);
};

const agreementGet = async function (req, res) {
  await agreementGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const agreementService = new AgreementService();
  const agreements = await agreementService.getAgreements(filter, limitOptions);
  const count = await agreementService.getAgreementsCount(filter);

  const url = 'agreement';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    agreements,
    links,
    count,
    query: { ...limitOptions, ...filter },
  });
};

const agreementSingleGet = async function (req, res) {
  await agreementIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const agreementService = new AgreementService();
  const agreement = await agreementService.getAgreementById(
    req.params.agreement_id,
  );

  if (!agreement) {
    throw new HttpError(
      404,
      `Agreement with id ${req.params.agreement_id} not found`,
    );
  }

  res.send(agreement);
};

const agreementPatch = async function (req, res) {
  await agreementPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await agreementIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const agreementService = new AgreementService();
  const result = await agreementService.updateAgreement({
    ...req.body,
    id: req.params.agreement_id,
  });

  res.send(result);
};

module.exports = {
  agreementPost,
  agreementGet,
  agreementPatch,
  agreementSingleGet,
};
