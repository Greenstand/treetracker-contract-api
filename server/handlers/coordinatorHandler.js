const Joi = require('joi');
const CoordinatorService = require('../services/CoordinatorService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');
const { coordinator_roles } = require('../utils/enums');

const coordinatorPostSchema = Joi.object({
  stakeholder_id: Joi.string().uuid().required(),
  coordinator_team_id: Joi.string().uuid().required(),
  coordinator_id: Joi.string().uuid(),
  role: Joi.string()
    .required()
    .valid(...Object.values(coordinator_roles)),
}).unknown(false);

const coordinatorGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  coordinator_team_id: Joi.string().uuid(),
  stakeholder_id: Joi.string().uuid(),
  coordinator_id: Joi.string().uuid(),
}).unknown(false);

const coordinatorPatchSchema = Joi.object({
  active: Joi.boolean(),
  role: Joi.string().valid(...Object.values(coordinator_roles)),
}).unknown(false);

const coordinatorIdParamSchema = Joi.object({
  coordinator_id: Joi.string().uuid(),
}).unknown(false);

const coordinatorPost = async function (req, res) {
  await coordinatorPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const coordinatorService = new CoordinatorService();
  const result = await coordinatorService.createCoordinator(req.body);

  res.status(201).send(result);
};

const coordinatorGet = async function (req, res) {
  await coordinatorGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const coordinatorService = new CoordinatorService();
  const coordinators = await coordinatorService.getCoordinators(
    filter,
    limitOptions,
  );
  const count = await coordinatorService.getCoordinatorsCount(filter);

  const url = 'coordinator';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    coordinators,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const coordinatorSingleGet = async function (req, res) {
  await coordinatorIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const coordinatorService = new CoordinatorService();
  const coordinator = await coordinatorService.getCoordinatorById(
    req.params.coordinator_id,
  );

  if (!coordinator) {
    throw new HttpError(
      404,
      `coordinator with id ${req.params.coordinator_id} not found`,
    );
  }

  res.send(coordinator);
};

const coordinatorPatch = async function (req, res) {
  await coordinatorPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await coordinatorIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const coordinatorService = new CoordinatorService();
  const result = await coordinatorService.updateCoordinatorService({
    ...req.body,
    id: req.params.coordinator_id,
  });

  res.send(result);
};

module.exports = {
  coordinatorPost,
  coordinatorGet,
  coordinatorPatch,
  coordinatorSingleGet,
};
