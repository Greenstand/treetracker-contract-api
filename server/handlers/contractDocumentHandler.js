const Joi = require('joi');

const ContractDocumentService = require('../services/ContractDocumentService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');

const contractDocumentPostSchema = Joi.object({
  contract_id: Joi.string().uuid().required(),
  document_id: Joi.string().uuid().required(),
  listed: Joi.boolean(),
}).unknown(false);

const contractDocumentGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
}).unknown(false);

const contractDocumentIdParamSchema = Joi.object({
  contract_document_id: Joi.string().uuid(),
}).unknown(false);

const contractDocumentPatchSchema = Joi.object({
  listed: Joi.boolean(),
}).unknown(false);

const contractDocumentPost = async function (req, res) {
  await contractDocumentPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const contractDocumentService = new ContractDocumentService();
  const result = await contractDocumentService.createContractDocument(req.body);

  res.status(201).send(result);
};

const contractDocumentGet = async function (req, res) {
  await contractDocumentGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const contractDocumentService = new ContractDocumentService();
  const contractDocuments = await contractDocumentService.getContractDocuments(
    filter,
    limitOptions,
  );
  const count = await contractDocumentService.getContractDocumentsCount(filter);

  const url = 'contract_document';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    contract_documents: contractDocuments,
    links,
    query: { count, ...limitOptions, ...filter },
  });
};

const contractDocumentSingleGet = async function (req, res) {
  await contractDocumentIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const contractDocumentService = new ContractDocumentService();
  const contractDocument =
    await contractDocumentService.getContractDocumentById(
      req.params.contract_document_id,
    );

  if (!contractDocument) {
    throw new HttpError(
      404,
      `contract with id ${req.params.contract_document_id} not found`,
    );
  }

  res.send(contractDocument);
};

const contractDocumentPatch = async function (req, res) {
  await contractDocumentPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await contractDocumentIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const contractDocumentService = new ContractDocumentService();
  const result = await contractDocumentService.updateContractDocument({
    ...req.body,
    id: req.params.contract_document_id,
  });

  res.send(result);
};

module.exports = {
  contractDocumentPost,
  contractDocumentGet,
  contractDocumentPatch,
  contractDocumentSingleGet,
};
