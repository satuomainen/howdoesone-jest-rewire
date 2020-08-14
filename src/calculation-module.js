const constants = require('./constants');

function calculateBusinessResults(resources) {
  return `${constants.ANALYTICS_SOURCE}: ${resources}`;
}

module.exports = {
  calculateBusinessResults
}
