const express = require('express');

const router = express.Router();
const { handlerWrapper } = require('./utils/utils');

const {
  documentPost,
  documentGet,
  documentSingleGet,
  documentPatch,
} = require('./handlers/documentHandler');

const {
  coordinationTeamPost,
  coordinationTeamGet,
  coordinationTeamSingleGet,
  coordinationTeamPatch,
} = require('./handlers/coordinationTeamHandler');

const {
  coordinatorPost,
  coordinatorGet,
  coordinatorPatch,
  coordinatorSingleGet,
} = require('./handlers/coordinatorHandler');

const {
  speciesAgreementPost,
  speciesAgreementGet,
  speciesAgreementPatch,
  speciesAgreementSingleGet,
} = require('./handlers/speciesAgreementHandler');

const {
  speciesPayoutPost,
  speciesPayoutGet,
  speciesPayoutPatch,
  speciesPayoutSingleGet,
} = require('./handlers/speciesPayoutHandler');

const {
  consolidationRulePost,
  consolidationRuleGet,
  consolidationRulePatch,
  consolidationRuleSingleGet,
} = require('./handlers/consolidationRuleHandler');

// DOCUMENT ROUTES
router
  .route('/document')
  .post(handlerWrapper(documentPost))
  .get(handlerWrapper(documentGet));
router
  .route('/document/:document_id')
  .get(handlerWrapper(documentSingleGet))
  .patch(handlerWrapper(documentPatch));

// COORDINATION TEAM ROUTES
router
  .route('/coordination_team')
  .post(handlerWrapper(coordinationTeamPost))
  .get(handlerWrapper(coordinationTeamGet));
router
  .route('/coordination_team/:coordination_team_id')
  .patch(handlerWrapper(coordinationTeamPatch))
  .get(handlerWrapper(coordinationTeamSingleGet));

// COORDINATOR ROUTES
router
  .route('/coordinator')
  .post(handlerWrapper(coordinatorPost))
  .get(handlerWrapper(coordinatorGet));
router
  .route('/coordinator/:coordinator_id')
  .patch(handlerWrapper(coordinatorPatch))
  .get(handlerWrapper(coordinatorSingleGet));

// SPECIES AGREEMENT ROUTES
router
  .route('/species_agreement')
  .post(handlerWrapper(speciesAgreementPost))
  .get(handlerWrapper(speciesAgreementGet));
router
  .route('/species_agreement/:species_agreement_id')
  .patch(handlerWrapper(speciesAgreementPatch))
  .get(handlerWrapper(speciesAgreementSingleGet));

// SPECIES PAYOUT ROUTES
router
  .route('/species_payout')
  .post(handlerWrapper(speciesPayoutPost))
  .get(handlerWrapper(speciesPayoutGet));
router
  .route('/species_payout/:species_payout_id')
  .patch(handlerWrapper(speciesPayoutPatch))
  .get(handlerWrapper(speciesPayoutSingleGet));

// CONSOLIDATION RULE ROUTES
router
  .route('/consolidation_rule')
  .post(handlerWrapper(consolidationRulePost))
  .get(handlerWrapper(consolidationRuleGet));
router
  .route('/consolidation_rule/:consolidation_rule_id')
  .patch(handlerWrapper(consolidationRulePatch))
  .get(handlerWrapper(consolidationRuleSingleGet));

module.exports = router;
