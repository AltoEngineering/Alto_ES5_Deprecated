Alto.FileUploadView = Alto.CoreView.extend({

    form: null,

    title: null,

    input: null,

    uploadButton: null,

    formData: new FormData(),

    action: null,


    /*
     Gets the template and passes html elements to viewDidLoad().

     We dont know anything about the html elements nor should
     we make that assumption.
     */
    viewWillLoad: function () {
        this.set('form', document.createElement('form'));
        this.set('title',document.createElement('div'));
        this.set('input', document.createElement('input'));
        this.set('uploadButton', document.createElement('button'));

        this.viewDidLoad(this.get('form'), this.get('title'),  this.get('uploadButton'), this.get('input'));
    },

    /*
     Has the html elements and passes them to viewWillAppear().

     We know about the html elements and can do some setup in here.
     Example: add disabled, hidden, etc className / adds alto object ids (maybe) / setup dynamic data and more...
     */
    viewDidLoad: function(form, title, uploadButton, input) {
        var that = this;

        if (form && title && uploadButton && input) {
            form.className = 'alto-file-upload-view';
            title.innerHTML = 'upload plan file'
            input.type = 'file';

            input.onchange = function () {
                that.fileDidChange(this);
            };

            form.appendChild(title);
            form.appendChild(uploadButton);
            form.appendChild(input);
        }

        this._super(form);
    },

    fileDidChange: function(input) {
        var path = input.value,
            fileName = path.split('\\')[path.split('\\').length - 1],
            title = this.get('title');

        title.innerHTML = fileName;
        title.style.color = '#2f4554';

        var APP = Alto.applicationName
        window[APP].statechart.dispatchEvent(this.get('action'), this);
    }

});