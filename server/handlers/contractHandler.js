const Joi = require('joi');

const ContractService = require('../services/ContractService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');
const { CONTRACT_STATUS } = require('../utils/enums');

const contractPostSchema = Joi.object({
  agreement_id: Joi.string().uuid().required(),
  worker_id: Joi.string().uuid().required(),
  notes: Joi.string(),
}).unknown(false);

const contractGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  agreement_id: Joi.string().uuid(),
  worker_id: Joi.string().uuid(),
  listed: Joi.boolean(),
  notes: Joi.string(),
  status: Joi.string(),
}).unknown(false);

const contractIdParamSchema = Joi.object({
  contract_id: Joi.string().uuid(),
}).unknown(false);

const contractPatchSchema = Joi.object({
  status: Joi.string().valid(...Object.values(CONTRACT_STATUS)),
  listed: Joi.boolean(),
  notes: Joi.string(),
}).unknown(false);

const contractPost = async function (req, res) {
  await contractPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const contractService = new ContractService();
  const result = await contractService.createContract(req.body);

  res.status(201).send(result);
};

const contractGet = async function (req, res) {
  await contractGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const contractService = new ContractService();
  const contracts = await contractService.getContracts(filter, limitOptions);
  const count = await contractService.getContractsCount(filter);

  const url = 'contract';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    contracts,
    links,
    count,
    query: { ...limitOptions, ...filter },
  });
};

const contractSingleGet = async function (req, res) {
  await contractIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const contractService = new ContractService();
  const contract = await contractService.getContractById(
    req.params.contract_id,
  );

  if (!contract) {
    throw new HttpError(
      404,
      `contract with id ${req.params.contract_id} not found`,
    );
  }

  res.send(contract);
};

const contractPatch = async function (req, res) {
  await contractPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await contractIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const contractService = new ContractService();
  const result = await contractService.updateContract({
    ...req.body,
    id: req.params.contract_id,
  });

  res.send(result);
};

module.exports = {
  contractPost,
  contractGet,
  contractPatch,
  contractSingleGet,
};
