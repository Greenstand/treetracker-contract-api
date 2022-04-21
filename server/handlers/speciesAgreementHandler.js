const Joi = require('joi');

const SpeciesAgreementService = require('../services/SpeciesAgreementService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');

const speciesAgreementPostSchema = Joi.object({
  name: Joi.string().required(),
  owner_id: Joi.string().uuid().required(),
  listed: Joi.boolean(),
  description: Joi.string(),
  variable_species_payout: Joi.boolean(),
}).unknown(false);

const speciesAgreementGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  owner_id: Joi.string().uuid(),
  name: Joi.string(),
  listed: Joi.boolean(),
}).unknown(false);

const speciesAgreementIdParamSchema = Joi.object({
  species_agreement_id: Joi.string().uuid(),
}).unknown(false);

const speciesAgreementPatchSchema = Joi.object({
  listed: Joi.boolean(),
}).unknown(false);

const speciesAgreementPost = async function (req, res) {
  await speciesAgreementPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const speciesAgreementService = new SpeciesAgreementService();
  const result = await speciesAgreementService.createSpeciesAgreement(req.body);

  res.status(201).send(result);
};

const speciesAgreementGet = async function (req, res) {
  await speciesAgreementGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const speciesAgreementService = new SpeciesAgreementService();
  const speciesAgreements = await speciesAgreementService.getSpeciesAgreements(
    filter,
    limitOptions,
  );
  const count = await speciesAgreementService.getSpeciesAgreementsCount(filter);

  const url = 'species_agreement';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    species_agreement: speciesAgreements,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const speciesAgreementPatch = async function (req, res) {
  await speciesAgreementPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await speciesAgreementIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const speciesAgreementService = new SpeciesAgreementService();
  const result = await speciesAgreementService.updateSpeciesAgreementService({
    ...req.body,
    id: req.params.species_agreement_id,
  });

  res.send(result);
};

const speciesAgreementSingleGet = async function (req, res) {
  await speciesAgreementIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const speciesAgreementService = new SpeciesAgreementService();
  const speciesAgreement =
    await speciesAgreementService.getSpeciesAgreementById(
      req.params.species_agreement_id,
    );

  if (!speciesAgreement) {
    throw new HttpError(
      404,
      `Species Agreement with id ${req.params.species_agreement_id} not found`,
    );
  }

  res.send(speciesAgreement);
};

module.exports = {
  speciesAgreementPost,
  speciesAgreementGet,
  speciesAgreementPatch,
  speciesAgreementSingleGet,
};
