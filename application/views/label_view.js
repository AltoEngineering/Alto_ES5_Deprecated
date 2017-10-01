import Alto from '../../core.js';
import CoreView from './core_view.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let LabelView = CoreView.extend({

    tag: 'div',

    isLabelView: true,

    title: null,

    escapeHtml: true,

    viewDidLoad: function (html) {
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

            this.updateElementTitle(html);

            this.viewWillAppear(html);
        } else {
            Alto.Console.error(`ViewDidLoad was invoked without passing a html element as an argument.  View can not be created.`);
            return;
        }
    },

    updateElementTitle: function (element) {
        if (!element) {
            return
        }

        let escapeHtml = this.get('escapeHtml');

        if (Alto.isEmpty(this.get("title"))) {
            element.textContent = '';
        } else if (escapeHtml) {
            element.textContent = this.get("title");
        } else {
            element.innerHTML = this.get("title");
        }
    },

    titleDidChange: function () {
        this.updateElementTitle(this.get('node)'));
    }

});

export default LabelView;