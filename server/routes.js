const express = require('express');

const router = express.Router();
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
