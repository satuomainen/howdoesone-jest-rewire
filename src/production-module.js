const calculator = require('./calculation-module');
const resourceManager = require('./resource-module');

function generateImportantBusinessData() {
  const resources = resourceManager.getResources();

  return calculator.calculateBusinessResults(resources);
}

module.exports = {
  generateImportantBusinessData,
};
