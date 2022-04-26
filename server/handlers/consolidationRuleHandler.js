const Joi = require('joi');

const ConsolidationRuleService = require('../services/ConsolidationRuleService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');

const consolidationRulePostSchema = Joi.object({
  owner_id: Joi.string().uuid().required(),
  name: Joi.string().required(),
  lambda: Joi.string().required(),
  parameters: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required(),
        value: Joi.string().required().allow(''),
      }),
    )
    .allow(null),
  listed: Joi.boolean(),
}).unknown(false);

const consolidationRuleGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  owner_id: Joi.string().uuid(),
  name: Joi.string(),
  listed: Joi.boolean(),
}).unknown(false);

const consolidationRuleIdParamSchema = Joi.object({
  consolidation_rule_id: Joi.string().uuid(),
}).unknown(false);

const consolidationRulePatchSchema = Joi.object({
  listed: Joi.boolean(),
}).unknown(false);

const consolidationRulePost = async function (req, res) {
  await consolidationRulePostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const consolidationRuleService = new ConsolidationRuleService();
  const result = await consolidationRuleService.createConsolidationRule(
    req.body,
  );

  res.status(201).send(result);
};

const consolidationRuleGet = async function (req, res) {
  await consolidationRuleGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const consolidationRuleService = new ConsolidationRuleService();
  const consolidationRules =
    await consolidationRuleService.getConsolidationRules(filter, limitOptions);
  const count = await consolidationRuleService.getConsolidationRulesCount(
    filter,
  );

  const url = 'consolidation_rule';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    consolidation_rules: consolidationRules,
    links,
    count,
    query: { ...limitOptions, ...filter },
  });
};

const consolidationRuleSingleGet = async function (req, res) {
  await consolidationRuleIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const consolidationRuleService = new ConsolidationRuleService();
  const consolidationRule =
    await consolidationRuleService.getConsolidationRuleById(
      req.params.consolidation_rule_id,
    );

  if (!consolidationRule) {
    throw new HttpError(
      404,
      `Consolidation Rule with id ${req.params.consolidation_rule_id} not found`,
    );
  }

  res.send(consolidationRule);
};

const consolidationRulePatch = async function (req, res) {
  await consolidationRulePatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await consolidationRuleIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const consolidationRuleService = new ConsolidationRuleService();
  const result = await consolidationRuleService.updateConsolidationRule({
    ...req.body,
    id: req.params.consolidation_rule_id,
  });

  res.send(result);
};

module.exports = {
  consolidationRulePost,
  consolidationRuleGet,
  consolidationRuleSingleGet,
  consolidationRulePatch,
};
