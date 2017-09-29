import isEmpty from './is_empty.js';

// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

export default function isBlank(obj) {
    return isEmpty(obj) || (typeof obj === 'string' && /\S/.test(obj) === false);
}