Alto.FileUploadView = Alto.CoreView.extend({

    // form api
    formMethod: 'post',

    form: null,

    formEnctype: null,

    formName: null,

    // label api
    title: null,

    label: null,

    // input file type api
    input: null,

    inputName: null,

    // upload button
    uploadButton: null,

    action: null,

    _formData: null,


    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        this.set('form', document.createElement('form'));
        this.set('label',document.createElement('div'));
        this.set('input', document.createElement('input'));
        this.set('uploadButton', document.createElement('button'));

        this.viewDidLoad(this.get('form'), this.get('label'),  this.get('uploadButton'), this.get('input'));
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(form, label, uploadButton, input) {
        var that = this;

        if (form && label && uploadButton && input) {
            form.className = 'alto-file-upload-view';
            form.enctype = this.get('formEnctype');
            form.method = this.get('formMethod');
            form.name = this.get('formName');

            label.textContent = this.get('title');

            input.type = 'file';
            input.name = this.get('inputName');

            input.onchange = function () {
                that.fileDidChange(this);
            };

            form.appendChild(label);
            form.appendChild(uploadButton);
            form.appendChild(input);
        }

        this._super(form);
    },

    /*
     Our html is now on the dom and can be queried.
     */
    viewDidAppear: function (form) {
        this._super(form);
        this.set('form', form);
        this.viewCreateSubViews();
    },

    fileDidChange: function(input) {
        var path = input.value,
            fileName = path.split('\\')[path.split('\\').length - 1],
            label = this.get('label');

        label.innerHTML = fileName;
        label.style.color = '#2f4554';

        this.set('_formData', new FormData(document.forms.namedItem(this.get('formName'))));
        var APP = Alto.applicationName
        window[APP].statechart.dispatchEvent(this.get('action'), this);
    }

});