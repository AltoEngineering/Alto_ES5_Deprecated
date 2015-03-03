Alto.KeyFormView = Alto.CoreView.extend({

    keyLabelClassNames: [],

    formViewClassNames: [],

    formValue: null,

    keyLabelTitle: null,

    isDefaultFocus: false,

    _keyLabel: null,

    _formView: null,

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        var node = document.createElement('div'),
            keyLabelView = document.createElement('div'),
            formView = document.createElement('input');

        this.set('_keyLabel', keyLabelView);
        this.set('_formView', formView);

        this.viewDidLoad(node, keyLabelView, formView);
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (node, keyLabelView, formView) {
        var that = this;

        node.className = "alto-key-form-view ";
        keyLabelView.className = "key-label ";
        formView.className = "form-view ";

        var n = 0,
            classNames = this.get('keyLabelClassNames');
        while (n < classNames.length) {
            keyLabelView.className += keyLabelView.className ? ' ' + classNames[n] : classNames[n];
            n++;
        }

        n = 0;
        classNames = this.get('formViewClassNames');
        while (n < classNames.length) {
            formView.className += formView.className ? ' ' + classNames[n] : classNames[n];
            n++;
        }

        formView.addEventListener("input", function () {
            that.inputDidChange(that.get('_formView'))
        }, false);

        if (this.get('formValue')) {
            formView.value = this.get('formValue')
        }

        if (this.get('isDefaultFocus')) {
            formView.autofocus = true;
        }

        keyLabelView.textContent = this.get('keyLabelTitle');

        node.appendChild(keyLabelView);
        node.appendChild(formView);

        this.viewWillAppear(node);
    },

    inputDidChange: function (_formView) {
        this.set('formValue', _formView.value);
    },

    formValueDidChange: function () {
        if (Alto.isEmpty(this.get("formValue"))) {
            this.get('_formView').value = '';
            return
        }

        this.get('_formView').value = this.get('formValue');
    }.observes('this.formValue')

});