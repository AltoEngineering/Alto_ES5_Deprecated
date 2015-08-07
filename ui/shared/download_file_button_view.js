Alto.DownloadFileButtonView = Alto.ButtonView.extend({

    downloadURL : null,

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