Alto.test = Alto.Object.createWithMixins({



    /** ====== SAMPLES ======


       Alto.test.uninstantiatedObject(function () {
        return LWCore.loginView;
       }, 'LWCore.loginView instance should be destroyed.', 600);

     */

    equals: function (expected, result, message, args, delay) {
        if (delay) {
            var pendingTestCell = this._assertPendingTest(message);

            var that = this;
            Alto.run.later(this, function () {
                var grade = Alto.isEqual.apply(args),
                    domString;

                if (grade) {
                    domString = '%@'.fmt(message);
                } else {
                    domString = '%@. Expected "%@".  Result "%@".'.fmt(message, expected, result);
                }

                that._assertUpdatedTestResults(pendingTestCell, grade, domString);

            }, pendingTestCell, delay);

        } else {
            var grade = Alto.isEqual(expected, result),
                domString;

            if (grade) {
                domString = '%@'.fmt(message);
            } else {
                domString = '%@. Expected "%@".  Result "%@".'.fmt(message, expected, result);
            }

            this._assertTestResults(grade, domString);
        }

    },

    empty: function (expression, message) {
        var grade = Alto.isEmpty(expression),
            domString;

        if (grade) {
            domString = '%@'.fmt(message);
        } else {
            domString = '%@ Result "%@".'.fmt(message, expression);
        }

        this._assertTestResults(grade, domString);
    },

    present: function(expression, message){
        var grade = Alto.isPresent(expression),
            domString;

        if (grade) {
            domString = '%@'.fmt(message);
        } else {
            domString = '%@ Result "%@".'.fmt(message, expression);
        }

        this._assertTestResults(grade, domString);
    },

    type: function (expected, result, message) {
        var grade = Alto.isEqual(expected.classify(), Alto.typeOf(result).classify()),
            domString;

        if (grade) {
            domString = '%@'.fmt(message);
        } else {
            domString = '%@. Expected "%@".  Result "%@".'.fmt(message, expected.classify(), Alto.typeOf(result).classify());
        }

        this._assertTestResults(grade, domString);
    },

    none: function (expression, message) {
        var grade = Alto.isNone(expression),
            domString;

        if (grade) {
            domString = '%@'.fmt(message);
        } else {
            domString = '%@ Result "%@".'.fmt(message, expression);
        }

        this._assertTestResults(grade, domString);
    },

    uninstantiatedObject: function (expression, message, delay) {

        if (delay) {
            var pendingTestCell = this._assertPendingTest(message),
                that = this;

            Alto.run.later(this, function () {
                var grade = Alto.isNone(expression()),
                    domString;

                if (grade) {
                    domString = '%@'.fmt(message);
                } else {
                    domString = '%@ Result "%@".'.fmt(message, Alto.typeOf(expression()).classify());
                }

                that._assertUpdatedTestResults(pendingTestCell, grade, domString);

            },pendingTestCell, delay);

        } else {
            var grade = Alto.isNone(expression),
                domString;

            if (grade) {
                domString = '%@'.fmt(message);
            } else {
                domString = '%@ Result "%@".'.fmt(message, Alto.typeOf(expression).classify());
            }

            this._assertTestResults(grade, domString);
        }
    },

    defer: function (operation, args, delay) {
        var pendingTestCell = this._assertPendingTest(),
            that = this;

        Alto.run.later(that, function () {
            operation.apply(that, args, delay);
           // that._assertUpdatedTestResults(pendingTestCell, grade, domString);

        },pendingTestCell, delay);
    },

    // ====== internal use only ====== //
    _list: document.querySelector('.test-list-view'),

    _passElement: document.querySelector('.passed'),

    _failElement: document.querySelector('.failed'),

    _passCount: 0,

    _failCount: 0,

    _assertTestResults: function (grade, domString) {
        var cell = document.createElement('li'),
            gradeElement = document.createElement('div'),
            messageElement = document.createElement('div'),
            list = this.get('_list');

        cell.className = 'cell';
        messageElement.innerText = domString;
        messageElement.className = 'message';

        if (grade) {
            gradeElement.className = 'grade-pass';
            this.incrementProperty('_passCount');
        } else {
            gradeElement.className = 'grade-fail';
            this.incrementProperty('_failCount');
        }

        cell.appendChild(gradeElement);
        cell.appendChild(messageElement);
        list.appendChild(cell);
    },

    _assertPendingTest: function (domString) {
        var cell = document.createElement('li'),
            gradeElement = document.createElement('div'),
            messageElement = document.createElement('div'),
            list = this.get('_list');

        cell.className = 'cell';
        messageElement.innerText = 'Pending test... %@'.fmt(domString);
        messageElement.className = 'message';
        gradeElement.className = 'grade-pending';

        cell.appendChild(gradeElement);
        cell.appendChild(messageElement);
        list.appendChild(cell);

        return cell;
    },

    _assertUpdatedTestResults: function (cell, grade, domString) {
        var list = this.get('_list'),
            gradeElement = cell.children[0]
        messageElement = cell.children[1];

        messageElement.innerText = domString;

        if (grade) {
            gradeElement.className = 'grade-pass';
            this.incrementProperty('_passCount');
        } else {
            gradeElement.className = 'grade-fail';
            this.incrementProperty('_failCount');
        }

    },

    _passCountDidChange: Alto.observer('_passCount', function() {
        var el = this.get('_passElement');
        el.innerText = '%@ passed'.fmt(this.get('_passCount'));
    }),

    _failCountDidChange: Alto.observer('_failCount', function() {
        var el = this.get('_failElement');
        el.innerText = '%@ failed'.fmt(this.get('_failCount'));
    })

});