Alto.ImageUploadView = Alto.CoreView.extend({

    label: null,

    title: null,

    form: null,

    formName: null,

    input: null,

    image: null,

    uploadedImage: null,

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

        this.get('label').remove();
        this.set('formData', new FormData(this.get('form')));
        reader.readAsDataURL(file);
    }

});
