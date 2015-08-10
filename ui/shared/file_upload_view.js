// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 `Alto.FileUploadView` is a component for uploading an image with server support. This instance take the provided image
 and encodes it into a base 64 format for previewing images while also creating a file form that can be sent
 via network call.

 Tip: use "`formEnctype: multipart/form-data`" for network calls requiring a file upload format.

 @module UI
 @class Alto.FileUploadView
 @extends Alto.CoreView
 @since Alto 0.0.1
 @author Chad Eubanks
 */


Alto.FileUploadView = Alto.CoreView.extend({

    // form api

    /**
     * Request command to server for sending the image.
     @property formMethod
     @default POST
     */
    formMethod: 'post',

    /**
     * Value of the form.
     @property form
     */
    form: null,

    /**
     * Encrpytion type of the form.
     @property formEnctype
     */
    formEnctype: null,

    /**
     *
     @property formName
     */
    formName: null,

    // label api

    /**
     *
     @property title
     */
    title: null,

    /**
     *
     @property label
     */
    label: null,

    // input file type api

    /**
     *
     @property input
     */
    input: null,

    /**
     *
     @property inputName
     */
    inputName: null,

    // upload button

    /**
     * Button used to activate the drop down for file selection.
     @property uploadButton
     */
    uploadButton: null,

    /**
     * Upon selecting a file, executes a subsequent action function.
     @property action
     */
    action: null,

    /**
     * Private variable that stores all the form data.
     @property _formData
     */
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

       //  label.innerHTML = fileName;
        label.style.color = '#2f4554';

        this.set('_formData', new FormData(document.forms.namedItem(this.get('formName'))));
        var APP = Alto.applicationName
        window[APP].statechart.dispatchEvent(this.get('action'), this);
    }

});