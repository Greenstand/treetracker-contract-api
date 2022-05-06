const speciesAgreement = require('../speciesAgreement/speciesAgreement2.json');
const { SPECIES_TYPE, CURRENCY } = require('../../../server/utils/enums');

const speciesPayout = {
  id: '491d0933-9061-4e2c-8b19-1c9a8bf6acb9',
  species_agreement_id: speciesAgreement.id,
  type: SPECIES_TYPE.specific,
  scientific_name: 'Peltophorum pterocarpum Becker',
  species_id: '60258ca1-4c59-4f77-906b-df2436b66713',
  payment: '100',
  payment_currency: CURRENCY.USD,
};

module.exports = speciesPayout;
