// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC and LifeWallet
// ==========================================================================

/**
 `Alto.NumbersOnlyMixin`

 @module UI
 @class Alto.NumbersOnlyMixin
 @extends Alto.Mixin
 @since Alto 0.0.1
 @author The Code Boutique
 */

Alto.NumbersOnlyMixin = Alto.Mixin.create({
    viewDidLoad: function (node) {
        this._super(node);
        var that = this;
        node.addEventListener("keyup", function (evt) {
            that.onKeyUp(evt)
        }, false);

        node.addEventListener("keydown", function (evt) {
            that.onKeyDown(evt)
        }, false);
    },

    onKeyDown: function (evt) {
        var keyCode = evt.keyCode;
        var isNotValidKey = this.isValidKey(keyCode);

        if (isNotValidKey) {
            evt = evt || window.event;
            if (typeof evt.preventDefault != "undefined") {
                evt.preventDefault();
            } else {
                evt.cancelBubble = true;
            }
        }
    },

    isValidKey: function (keyCode) {
        return (!this._numKeys(keyCode) && !this._numPadKeys(keyCode) && !this._functionalKeys(keyCode) && !this._arrowKeys(keyCode));
    },

    _numKeys: function (keyCode) {
        return (keyCode >= 48 && keyCode <= 57);
    },

    _numPadKeys: function (keyCode) {
        return (keyCode >= 96 && keyCode <= 105);
    },

    _functionalKeys: function (keyCode) {
        return (keyCode === 8 || keyCode === 9 || keyCode === 13 || keyCode === 46);
    },

    _arrowKeys: function (keyCode) {
        return (keyCode >= 37 && keyCode <= 40);
    }
});