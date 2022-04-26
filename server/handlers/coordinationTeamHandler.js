const Joi = require('joi');
const CoordinationTeamService = require('../services/CoordinationTeamService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');

const coordinationTeamPostSchema = Joi.object({
  owner_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  listed: Joi.boolean(),
}).unknown(false);

const coordinationTeamGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  name: Joi.string(),
  listed: Joi.boolean(),
  owner_id: Joi.string().uuid(),
}).unknown(false);

const coordinationTeamPatchSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  listed: Joi.boolean(),
}).unknown(false);

const coordinationTeamIdParamSchema = Joi.object({
  coordination_team_id: Joi.string().uuid(),
}).unknown(false);

const coordinationTeamPost = async function (req, res) {
  await coordinationTeamPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const coordinationTeamService = new CoordinationTeamService();
  const result = await coordinationTeamService.createCoordinationTeam(req.body);

  res.status(201).send(result);
};

const coordinationTeamGet = async function (req, res) {
  await coordinationTeamGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const coordinationTeamService = new CoordinationTeamService();
  const coordinationTeams = await coordinationTeamService.getCoordinationTeams(
    filter,
    limitOptions,
  );
  const count = await coordinationTeamService.getCoordinationTeamsCount(filter);

  const url = 'coordination_team';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    coordination_teams: coordinationTeams,
    links,
    count,
    query: { ...limitOptions, ...filter },
  });
};

const coordinationTeamSingleGet = async function (req, res) {
  await coordinationTeamIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const coordinationTeamService = new CoordinationTeamService();
  const coordinationTeam =
    await coordinationTeamService.getCoordinationTeamById(
      req.params.coordination_team_id,
    );

  if (!coordinationTeam) {
    throw new HttpError(
      404,
      `Coordination team with id ${req.params.coordination_team_id} not found`,
    );
  }

  res.send(coordinationTeam);
};

const coordinationTeamPatch = async function (req, res) {
  await coordinationTeamPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await coordinationTeamIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const coordinationTeamService = new CoordinationTeamService();
  const result = await coordinationTeamService.updateCoordinationTeam({
    ...req.body,
    id: req.params.coordination_team_id,
  });

  res.send(result);
};

module.exports = {
  coordinationTeamPost,
  coordinationTeamGet,
  coordinationTeamSingleGet,
  coordinationTeamPatch,
};
