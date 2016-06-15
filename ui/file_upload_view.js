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
 @author Chad Eubanks & Anthony Alviz
 */


Alto.FileUploadView = Alto.CoreView.extend({

    //Required fields for building the formData. Do not change.
    formMethod: 'post',
    formEnctype: 'multipart/form-data',
    formName: 'csvUpload',
    inputName: 'csv',

    //Label to initiate the file selection
    uploadButtonLabel: null,

    //Label to show the file selected
    uploadFileLabel: '',

    //Form data object
    value: null,

    image: null,

    isPreview: false,

    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        this.set('form', document.createElement('form'));
        this.set('input', document.createElement('input'));
        this.set('fileFrame', document.createElement('div'));
        this.set('uploadLabel', document.createElement('div'));
        this.set('fileLabel', document.createElement('div'));

        this.viewDidLoad(this.get('form'), this.get('input'), this.get('uploadLabel'), this.get('fileLabel'), this.get('fileFrame'));
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function (form, input, uploadLabel, fileLabel, fileFrame) {
        var that = this;

        form.className = 'file-upload-view';
        form.enctype = this.get('formEnctype');
        form.method = this.get('formMethod');
        form.name = this.get('formName');

        uploadLabel.textContent = this.get('uploadButtonLabel');
        uploadLabel.className = 'upload-label';

        fileLabel.textContent = this.get('uploadFileLabel');
        fileLabel.className = 'file-label';

        fileFrame.className = 'file-frame';

        input.type = 'file';
        input.name = this.get('inputName');

        input.onchange = function (event) {
            that.updateLabels();
            that.fileDidChange(this);

            if (that.get('isPreview')) {
                that._previewFile(event.target.files[0]);
            }
        };

        fileFrame.appendChild(uploadLabel);

        form.appendChild(input);
        form.appendChild(fileFrame);

        form.__alto_object__ = this;

        this._super(form);
    },

    fileDidChange: function (input) {
        var path = input.value,
            fileName = path.split('\\')[path.split('\\').length - 1],
            fileLabel = this.get('fileLabel');

        fileLabel.textContent = fileName;
        fileLabel.style.color = '#2f4554';

        this.set('_formData', new FormData(document.forms.namedItem(this.get('formName'))));
        this.set('value', this.get('_formData'));
    },

    valueDidChange: Alto.observer('value', function () {
        var value = this.get('value');

        if (Alto.isEmpty(value)) {
            this.set('input.value', '');
            this.updateLabels();
        }
    }),

    updateLabels: function () {
        var node = this.get('fileFrame');

        if (Alto.isPresent(this.get('input.value'))) {
            node.removeChild(node.children[0]);
            node.appendChild(this.get('fileLabel'));
        } else {
            node.removeChild(node.children[0]);
            node.appendChild(this.get('uploadLabel'));
        }
    },

    _previewFile: function (file) {
        var that = this,
            reader = new FileReader();

        reader.onload = function () {
            that.set('image', reader.result);
        }
        reader.readAsDataURL(file);
    }
});