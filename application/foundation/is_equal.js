// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks

export default function isEqual(a, b) {
    if (a && typeof a.isEqual === 'function') {
        return a.isEqual(b);
    }

    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    return a === b;
}