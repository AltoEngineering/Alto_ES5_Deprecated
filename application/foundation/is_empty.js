import isNone from './is_none.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

export default function isEmpty(obj) {
    let none = isNone(obj);
    if (none) {
        return none;
    }

    if (typeof obj.size === 'number') {
        return !obj.size;
    }

    let objectType = typeof obj;

    if (objectType === 'object') {
        let size = obj['size'];
        if (typeof size === 'number') {
            return !size;
        }
    }

    if (typeof obj.length === 'number' && objectType !== 'function') {
        return !obj.length;
    }

    if (objectType === 'object') {
        let length = obj['length'];
        if (typeof length === 'number') {
            return !length;
        }
    }

    if (objectType === 'object') {
        let length = Object.keys(obj).length;
        if (typeof length === 'number') {
            return !length;
        }
    }

    return false;
}