import Alto from '../../core.js';
import CoreView from './core_view.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let ButtonView = CoreView.extend({

    isButtonView: true,

    tag: 'button',

    title: null,

    action: null,

    viewDidLoad: function (html) {
        var title = this.get('title'),
            action = this.get('action');

        if (Alto.isPresent(title)) {
            html.innerText = title;
        } else {
            Alto.Console.error(`Alto.Button requires a title.  Make sure you provide a value.  Button can not be created.`);
            return;
        }

        if (Alto.isEmpty(action)) {
            Alto.Console.error(`Alto.Button requires an action.  Make sure you provide a value.  Button can not be created.`);
            return;
        }

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

            this.viewWillAppear(html);
        } else {
            Alto.Console.error(`ViewDidLoad was invoked without passing a html element as an argument.  View can not be created.`);
            return;
        }
    },

    titleDidChange: function () {
        if (this.node) {
            this.node.innerText = this.get('title');
        }
    }

});

export default ButtonView;