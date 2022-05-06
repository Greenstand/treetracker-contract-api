const fs = require('fs');
const Joi = require('joi');

const DocumentService = require('../services/DocumentService');
const {
  generatePrevAndNext,
  getFilterAndLimitOptions,
} = require('../utils/helper');
const HttpError = require('../utils/HttpError');

const documentPostSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  version: Joi.number().integer(),
}).unknown(false);

const documentGetQuerySchema = Joi.object({
  offset: Joi.number().integer().greater(-1),
  limit: Joi.number().integer().greater(0),
  name: Joi.string(),
  listed: Joi.boolean(),
}).unknown(false);

const documentIdParamSchema = Joi.object({
  document_id: Joi.string().uuid(),
}).unknown(false);

const documentPatchSchema = Joi.object({
  listed: Joi.boolean(),
}).unknown(false);

const documentPost = async function (req, res, next) {
  if (req.file.mimetype !== 'application/pdf')
    throw new HttpError(406, 'Only pdf documents are supported');

  try {
    await documentPostSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (e) {
    // remove uploaded file if validation fails
    await fs.promises.unlink(req.file.path);
    next(e);
  }

  const documentService = new DocumentService();
  const result = await documentService.createDocument(req.body, req.file);

  res.status(201).send(result);
};

const documentGet = async function (req, res) {
  await documentGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const documentService = new DocumentService();
  const documents = await documentService.getDocuments(filter, limitOptions);
  const count = await documentService.getDocumentsCount(filter);

  const url = 'document';

  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({ documents, links, count, query: { ...limitOptions, ...filter } });
};

const documentSingleGet = async function (req, res) {
  await documentIdParamSchema.validateAsync(req.params, { abortEarly: false });

  const documentService = new DocumentService();
  const document = await documentService.getDocumentById(
    req.params.document_id,
  );

  if (!document) {
    throw new HttpError(
      404,
      `Document with id ${req.params.document_id} not found`,
    );
  }

  res.send(document);
};

const documentPatch = async function (req, res) {
  await documentPatchSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  await documentIdParamSchema.validateAsync(req.params, {
    abortEarly: false,
  });

  const documentService = new DocumentService();
  const result = await documentService.updateDocument({
    ...req.body,
    id: req.params.document_id,
  });

  res.send(result);
};

module.exports = {
  documentPost,
  documentGet,
  documentSingleGet,
  documentPatch,
};
