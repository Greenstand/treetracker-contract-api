const express = require('express');

const router = express.Router();
const { handlerWrapper } = require('./utils/utils');

const {
  documentPost,
  documentGet,
  documentSingleGet,
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

router
  .route('/document')
  .post(handlerWrapper(documentPost))
  .get(handlerWrapper(documentGet));
router.route('/document/:document_id').get(handlerWrapper(documentSingleGet));

router
  .route('/coordination_team')
  .post(handlerWrapper(coordinationTeamPost))
  .get(handlerWrapper(coordinationTeamGet));
router
  .route('/coordination_team/:coordination_team_id')
  .patch(handlerWrapper(coordinationTeamPatch))
  .get(handlerWrapper(coordinationTeamSingleGet));

router
  .route('/coordinator')
  .post(handlerWrapper(coordinatorPost))
  .get(handlerWrapper(coordinatorGet));
router
  .route('/coordinator/:coordinator_id')
  .patch(handlerWrapper(coordinatorPatch))
  .get(handlerWrapper(coordinatorSingleGet));

module.exports = router;
