/*
  @license
	Rollup.js v2.61.1
	Sat, 11 Dec 2021 06:17:07 GMT - commit 2e91c85fc95bc722e5a7141d7fa0acde4aab61aa


	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

require('fs');
require('path');
require('url');
const loadConfigFile_js = require('./shared/loadConfigFile.js');
require('./shared/rollup.js');
require('./shared/mergeOptions.js');
require('process');
require('tty');
require('crypto');
require('events');



module.exports = loadConfigFile_js.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
