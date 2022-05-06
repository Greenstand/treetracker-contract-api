exports.seed = async function (knex) {
  await knex('fcc_tiered_configuration').del();
  await knex('agreement_region').del();
  await knex('contract_document').del();
  await knex('contract').del();
  await knex('document').del();
  await knex('agreement').del();
  await knex('coordinator').del();
  await knex('coordination_team').del();
  await knex('species_payout').del();
  await knex('species_agreement').del();
  await knex('consolidation_rule').del();
};
