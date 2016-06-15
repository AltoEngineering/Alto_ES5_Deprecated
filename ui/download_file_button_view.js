alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/button_view.js');

Alto.DownloadFileButtonView = Alto.ButtonView.extend({

    downloadURL : null,

    title: null,

    action: 'downloadFile',

    click: function () {
        var downloadHiddenView = document.createElement('div'),
            iframe = document.createElement('iframe');

        downloadHiddenView.style.display = 'none';
        iframe.src = this.get('downloadURL');

        iframe.addEventListener('load', function() {
            Alto.DomUtil.removeNodeFromParent(downloadHiddenView, 'body');
        });

        downloadHiddenView.appendChild(iframe);

        Alto.DomUtil.addElementToNode(downloadHiddenView, 'body');
    }

});