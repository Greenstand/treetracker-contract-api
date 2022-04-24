const Joi = require('joi');

const SpeciesPayoutService = require('../services/SpeciesPayoutService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');
const { SPECIES_TYPE, CURRENCY } = require('../utils/enums');

const speciesPayoutPostSchema = Joi.object({
  species_agreement_id: Joi.string().uuid().required(),
  type: Joi.string()
    .valid(...Object.values(SPECIES_TYPE))
    .required(),
  scientific_name: Joi.string().required(),
  species_id: Joi.string().uuid().required(),
  payment: Joi.number().required(),
  payment_currency: Joi.string()
    .valid(...Object.values(CURRENCY))
    .required(),
}).unknown(false);

const speciesPayoutGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  species_agreement_id: Joi.string().uuid(),
  species_id: Joi.string().uuid(),
  payment_currency: Joi.string().valid(...Object.values(CURRENCY)),
  type: Joi.string().valid(...Object.values(SPECIES_TYPE)),
  scientific_name: Joi.string(),
}).unknown(false);

const speciesPayoutIdParamSchema = Joi.object({
  species_payout_id: Joi.string().uuid(),
}).unknown(false);

const speciesPayoutPatchSchema = Joi.object({
  open: Joi.boolean().valid(false),
}).unknown(false);

const speciesPayoutPost = async function (req, res) {
  await speciesPayoutPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const speciesPayoutService = new SpeciesPayoutService();
  const result = await speciesPayoutService.createSpeciesPayout(req.body);

  res.status(201).send(result);
};

const speciesPayoutGet = async function (req, res) {
  await speciesPayoutGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const speciesPayoutService = new SpeciesPayoutService();
  const speciesPayouts = await speciesPayoutService.getSpeciesPayouts(
    filter,
    limitOptions,
  );
  const count = await speciesPayoutService.getSpeciesPayoutsCount(filter);

  const url = 'species_payout';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    species_payout: speciesPayouts,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const speciesPayoutPatch = async function (req, res) {
  await speciesPayoutPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await speciesPayoutIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const speciesPayoutService = new SpeciesPayoutService();
  const result = await speciesPayoutService.updateSpeciesPayout({
    ...req.body,
    id: req.params.species_payout_id,
  });

  res.send(result);
};

const speciesPayoutSingleGet = async function (req, res) {
  await speciesPayoutIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const speciesPayoutService = new SpeciesPayoutService();
  const speciesPayout = await speciesPayoutService.getSpeciesPayoutById(
    req.params.species_payout_id,
  );

  if (!speciesPayout) {
    throw new HttpError(
      404,
      `Species Payout with id ${req.params.species_payout_id} not found`,
    );
  }

  res.send(speciesPayout);
};

module.exports = {
  speciesPayoutPost,
  speciesPayoutGet,
  speciesPayoutPatch,
  speciesPayoutSingleGet,
};
