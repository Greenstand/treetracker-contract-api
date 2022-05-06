const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'tmp/doc/' });
const handlers = require('./handlers');
const { handlerWrapper } = require('./utils/utils');
const { snakeToCamelCase } = require('./utils/helper');

const routes = [
  'document',
  'coordination_team',
  'coordinator',
  'species_agreement',
  'species_payout',
  'consolidation_rule',
  'agreement',
  'agreement_region',
  'contract',
  'contract_document',
];

// 'custom' routes
router.post(
  '/document',
  upload.single('document'),
  handlerWrapper(handlers.documentPost),
);

routes.forEach((r) => {
  const R = snakeToCamelCase(r);
  router
    .route(`/${r}`)
    .post(handlerWrapper(handlers[`${R}Post`]))
    .get(handlerWrapper(handlers[`${R}Get`]));
  router
    .route(`/${r}/:${r}_id`)
    .get(handlerWrapper(handlers[`${R}SingleGet`]))
    .patch(handlerWrapper(handlers[`${R}Patch`]));
});

module.exports = router;
