const { getPreflopGtoRecommendation } = require('./preflop-gto-baseline');

function getCoachPreflopRecommendation(context) {
  return getPreflopGtoRecommendation(context);
}

module.exports = {
  getCoachPreflopRecommendation,
};
