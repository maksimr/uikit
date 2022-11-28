// @ts-expect-error
import { runOnlyAffectedTests } from '@maksimr/karma-test-utils/lib/run-only-affected-tests';
const testsContext = require.context('../lib', true, /(.*\.test\.js$)/);
runOnlyAffectedTests(testsContext);