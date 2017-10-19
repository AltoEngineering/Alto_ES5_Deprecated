import Alto from '../../core.js';
import CoreView from './core_view.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let SelectMenuView = CoreView.extend({

    isSelectMenuView: true,

    tag: 'select',

    hint: null,

    data: null,

    value: null,

    viewDidLoad: function (html) {
        let that = this;

        if (Alto.isPresent(html) || !Alto.isNone(html)) {

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

            html.addEventListener('input', function (event) {
                that.inputDidChange(event);
            }, false);

            if (Alto.isPresent(this.get('value'))) {
                html.value = this.get('value');
            } else {
                html.value = this.get('hint');
            }

            this.viewWillAppear(html);
        } else {
            Alto.Console.error(`ViewDidLoad was invoked without passing a html element as an argument.  View can not be created.`);
            return;
        }
    },

    viewCreateSubViews: function (html) {
        let node = this.get('node'),
            children = this.get('data'),
            hint = this.get('hint'),
            property = this.get('property');

        if (!node ) {return};

        if (Alto.isPresent(hint)) {
            let option = document.createElement('option');

            option.innerText = hint;
            option.disabled = true;

            node.appendChild(option);

            node.value = hint;
        }

        if (Alto.isPresent(children)) {
            children.forEach(function (obj) {
                let option = document.createElement('option');

                node.style.display = null;
                option.innerText = obj[property];
                node.appendChild(option);
            })
        } else {
            node.style.display = 'none';
        }

        this.viewAnimateIn();
    },

    inputDidChange: function (event) {
        this.set('value', event.target.value);
    },

    dataDidChange: function () {
        if (!this.node) {return};

        Alto.DomUtil.removeAllChildren(this.get('node'));
        this.viewCreateSubViews(this.get('node'));
    }

});

export default SelectMenuView;
