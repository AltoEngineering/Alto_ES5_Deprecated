// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

let _uuid = 0;

export default function generateGuid() {
    let uuid = `alto${_uuid ++}`;
    return uuid;
};