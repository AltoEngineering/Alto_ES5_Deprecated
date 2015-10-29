


Alto.ImageUploadView = Alto.CoreView.extend({

    /**
     * Label of the image.
     @property label
     */
    label: null,

    /**
     * Title of the image upload.
     @property title
     */
    title: null,

    /**
     * Contents of the label being uploaded.
     @property form
     */
    form: null,

    /**
     * Name of form being sent.
     @property formName
     */
    formName: 'image-upload',

    /**
     * Contents of the image being uploaded.
     @property input
     */
    input: null,

    /**
     * Full source path of the image.
     @property image
     */
    image: null,

    /**
     * Full source path of the image in base 64 encoding.
     @property uploadedImage
     */
    uploadedImage: null,

    /**
     * Entire form of image data.
     @property formData
     */
    formData: null,

    viewWillLoad: function () {
        this.set('form', document.createElement('form'));
        this.set('label', document.createElement('div'));
        this.set('input', document.createElement('input'));
        this.set('image', document.createElement('img'));

        this.viewDidLoad(this.get('form'), this.get('label'), this.get('input'), this.get('image'));
    },

    viewDidLoad: function (form, label, input, image) {
        var that = this;

        input.type = 'file';
        input.name = this.get('formName');
        input.addEventListener("change", function () {
            that.inputValueDidChange(input)
        }, false);

        label.textContent = this.get('title');

        if (!Alto.isEmpty(this.get('uploadedImage'))) {
            image.src = this.get('uploadedImage');
            form.appendChild(image);
        } else {
            form.appendChild(label);
        }


        form.method = 'post',
        form.enctype = 'multipart/form-data',
        form.className = 'alto-file-upload-view';
        form.name ['dependent-image']
        form.appendChild(input);

        this.viewWillAppear(form);
    },

    inputValueDidChange: function (input) {
        var file = input.files[0],
            that = this,
            reader = new FileReader();

        reader.onload = function (e) {
            var img = that.get('image');

            img.src = reader.result;
            that.set('uploadedImage', reader.result);
            that.get('form').appendChild(img);
        }

        this.get('label').parentNode.removeChild(this.get('label'));
        this.set('formData', new FormData(this.get('form')));
        reader.readAsDataURL(file);
    }

});
