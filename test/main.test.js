import { runOnlyAffectedTests } from './test-util';
const testsContext = require.context('../lib', true, /(.*\.test\.js$)/);
runOnlyAffectedTests(testsContext);