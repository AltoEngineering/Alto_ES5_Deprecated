import CoreView from '../core_view.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

const ModalPane = CoreView.extend({

    isModalPane:  true,

    tag: 'div',

    animationDuration: 0.3,

    childViews: ['contentView'],

    contentView: null

});

export default ModalPane;