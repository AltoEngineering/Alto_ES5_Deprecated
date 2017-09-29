import Application from './application/application.js';
import ArrayController from './application/data/controllers/array_controller.js';
import Binding from './application/foundation/bindings.js';
import BindingProtocol from './application/foundation/protocols/binding_protocol.js';
import ButtonView from './application/views/button_view.js';
import Console from './application/foundation/console.js';
import CoreObject from './application/foundation/core_object.js';
import Datastore from './application/data/datastore.js';
import DomUtil from './application/views/utils/dom_util.js';
import ImageView from './application/views/image_view.js';
import ListView from './application/views/list_view.js';
import ObjectController from './application/data/controllers/object_controller.js';
import Router from './application/routing/router.js';
import State from './application/statechart/state.js';
import Statechart from './application/statechart/statechart.js';
import Substate from './application/statechart/substate.js';
import TextFieldView from './application/views/text_field_view.js';
import View from './application/views/view.js';
import Window from './application/views/window.js';

import generateGuid from './application/foundation/guid.js';
import isBlank from './application/foundation/is_blank.js';
import isEmpty from './application/foundation/is_empty.js';
import isEqual from './application/foundation/is_equal.js';
import isNone from './application/foundation/is_none.js';
import isPresent from './application/foundation/is_present.js';
// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2017 The Code Boutique, LLC
// License:   MIT License (see license for details)
// Author: Chad Eubanks
// ==========================================================================

class Alto {

    constructor() {
        this.Application = Application;
        this.ArrayController = ArrayController;
        this.Binding = Binding;
        this.BindingProtocol = BindingProtocol;
        this.ButtonView = ButtonView;
        this.Console = Console;
        this.CoreObject = CoreObject;
        this.Datastore = Datastore;
        this.DomUtil = DomUtil;
        this.ImageView = ImageView;
        this.ListView = ListView;
        this.ObjectController = ObjectController;
        this.Router = Router;
        this.State = State;
        this.Statechart = Statechart;
        this.Substate = Substate;
        this.TextFieldView = TextFieldView;
        this.View = View;
        this.Window = Window;

        this.generateGuid = generateGuid;
        this.isBlank = isBlank;
        this.isEmpty = isEmpty;
        this.isEqual = isEqual;
        this.isNone = isNone;
        this.isPresent = isPresent;
    }

};

window.Alto = new Alto();

export default window.Alto;