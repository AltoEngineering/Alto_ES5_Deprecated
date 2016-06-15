alto_require('tests/test_suite/test_mock_utils.js');
alto_require('tests/test_suite/test.js');

Alto.TestModule = Alto.Object.extend({

    moduleName: null,

    init: function () {
        var that = this;

        that._assertTestModuleCell();
        that.setup();

        Alto.keys(this).forEach(function (testCase) {
            if (testCase === 'setup' | testCase === 'teardown' | typeof that[testCase] === 'string' | typeof that[testCase] === 'object') {
                return
            }

            Alto.run.begin();
            that[testCase]();
            Alto.run.end();

        });

        that.teardown();
    },

    setup: function () {

    },

    teardown: function () {

    },

    // ====== internal use only ====== //
    _list: document.querySelector('.test-list-view'),

    _assertTestModuleCell: function () {
        var cell = document.createElement('li'),
            moduleNameElement = document.createElement('div'),
            list = this.get('_list');

        cell.className = 'module-cell';
        moduleNameElement.innerText = this.get('moduleName');
        moduleNameElement.className = 'module-name';

        cell.appendChild(moduleNameElement);
        list.appendChild(cell);
    }

});