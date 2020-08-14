const rewire = require('rewire');

describe('Examples how to use rewire', () => {
  const productionRewired = rewire('./production-module');
  let restoreProductionModule;

  const mockGetResources = () => 'I am here to mock you every time';
  const mockAnalyticsSource = 'Mocker Analytics';

  beforeEach(() => {
    // Install mocks for all tests in suite and get a function to restore the module
    restoreProductionModule = productionRewired
      .__set__('resourceManager.getResources', mockGetResources);
  })

  afterEach(() => {
    // Restore the module to get consistent results in other suites
    restoreProductionModule();
  });

  test('Restoring the suite level module will restore to the original state', () => {
    restoreProductionModule();
    expect(productionRewired.generateImportantBusinessData())
      .toBe(`Original Analytics: Business is good`);
  })

  test('beforeAll has replaced the resource string with mock', () => {
    expect(productionRewired.generateImportantBusinessData())
      .toBe(`Original Analytics: I am here to mock you every time`);
  });

  test('Mock a constant value just for this test case', () => {
    const calculatorRewired = rewire('./calculation-module');
    const restoreOriginalAnalyticsSource = calculatorRewired
      .__set__('constants.ANALYTICS_SOURCE', mockAnalyticsSource);

    expect(productionRewired.generateImportantBusinessData())
      .toBe('Mocker Analytics: I am here to mock you every time');

    restoreOriginalAnalyticsSource();
  })

  test('Restoring has restored the original constant value', () => {
    expect(productionRewired.generateImportantBusinessData())
      .toBe(`Original Analytics: I am here to mock you every time`);
  });

});

// Here's a way that does not work when it's run repeatedly with --watch. Both tests will pass
// the first time, but when you make a change and the runner runs the tests the second time,
// there will be a mismatch between expectation and actual in Case 1:
//
//    Expected: "Original Analytics: We will mock you"
//    Received: "Underes: We will mock you"
//
// This way will also mess up other suites in this module.
//
describe.skip('Brute force function replacement by assignment', () => {

  test('Case 1: Function can be replaced directly in the SUT by assignment...', () => {
    const productionRewired = rewire('./production-module');

    // Violently replace a function in a dependency that the module being tested has required...
    productionRewired.
      __get__('resourceManager')
      .getResources = () => 'We will mock you';

    // ...the downside with this way is that you don't get a restore function like you do
    // with __set__ and therefore, when running tests with --watch, you might not get the
    // same result again.
    //
    // This assertion will fail the second time you run this suite under --watch because
    // the constants.js module's ANALYTICS_SOURCE has been set during the first execution
    // round but not restore after the test.
    expect(productionRewired.generateImportantBusinessData())
      .toBe('Original Analytics: We will mock you');
  });

  test('Case 2: ...likewise anything in an exported dependency can be rewired easily', () => {
    const productionRewired = rewire('./production-module');
    const resourcesRewired = rewire('./resource-module');

    resourcesRewired
      .__get__('constants')
      .ANALYTICS_SOURCE = 'Underes';

    // Note that productionRewired has NOT been restored and you will keep getting the mock
    // constant value when Case 1 is ran again.
    expect(productionRewired.generateImportantBusinessData())
      .toBe(`Underes: We will mock you`);
  });

});
