import Alto from '../../core.js';
import CoreView from './view.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let ImageView = CoreView.extend({

    isImageView: true,

    tag: 'img',

    src: null,

    alt: null,

    viewDidLoad(html) {
        if (Alto.isPresent(html)) {

            let classNames = this.get('classNames'),
                id = this.get('layerId'),
                isVisible = this.get('isVisible');

            if (Alto.isPresent(classNames)) {
                classNames.forEach(function (className) {
                    html.classList.add(className);
                })
            }

            if (Alto.isPresent(id)) {
                html.id = id;
            }

            if (!isVisible) {
                html.classList.add('hidden');
            }

            if (this.get("src")) {
                html.src = this.get("src");
            }

            this.viewWillAppear(html);
        } else {
            Alto.Console.error(`ViewDidLoad was invoked without passing a html element as an argument.  View can not be created.`);
            return;
        }
    }

});

export default ImageView;