const { COORDINATOR_ROLES } = require('../../../server/utils/enums');
const reportsToCoordinator = require('./coordinator2');

const coordinator = {
  stakeholder_id: 'f6ff1bf9-1a1d-4f63-9e7a-de1c7366a660',
  coordinator_team_id: reportsToCoordinator.coordinator_team_id,
  reports_to_coordinator_id: reportsToCoordinator.id,
  role: COORDINATOR_ROLES.supervisor,
};

module.exports = coordinator;
