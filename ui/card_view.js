// ==========================================================================
// Project: Alto - JavaScript Application Framework
// Copyright: @2014 The Code Boutique, LLC
// License:   Intellectual property of The Code Boutique. LLC
// ==========================================================================

/**
 Gives logging to your console some color.

 @module UI
 @class Alto.CardView
 @extends Alto.View
 @since Alto 0.0.1
 @author Anthony Alviz
 */
alto_require('frameworks/shared/altojs/ui/core_view.js');
alto_require('frameworks/shared/altojs/ui/image_view.js');
alto_require('frameworks/shared/altojs/ui/key_label_view.js');
alto_require('frameworks/shared/lw/ui/components/insurance_badge_cell.js');

Alto.CardView = Alto.View.extend({
    classNames: ['card-view'],
    childViews: ['InsuranceBadgeIcon', 'CarrierTheme', 'Name', 'CardDetails', 'EmptyMessage'],

    /**
     * Controller that values bind to in order to build the template card
     **/
    controller: null,

    EmptyMessage: Alto.LabelView.extend({
        tag: 'div',
        classNames: ['empty-message'],
        title: 'Start building your card',
        isVisibleBinding: 'parentView.controller.isEmpty'
    }),

    InsuranceBadgeIcon: LW.InsuranceBadgeCell.extend({
        insuranceTypeBinding: 'parentView.controller.insuranceType'
    }),

    CarrierTheme: Alto.ImageView.extend({
        classNames: ['carrier-theme']
        //srcBinding: 'parentView.controller.carrierTheme',
        //isVisibleBinding: 'parentView.controller.carrierTheme'

    }),

    Name: Alto.LabelView.extend({
        tag: 'div',
        classNames: ['name-label'],
        titleBinding: 'parentView.controller.fullName'
    }),

    CardDetails: Alto.View.extend({
        classNames: ['key-list'],
        childViews: ['Group', 'Member', 'Policy', 'ExpirationDate'],

        Group: Alto.View.extend({
            classNames: ['group'],
            childViews: ['Key', 'Value'],
            isVisibleBinding: 'parentView.parentView.controller.groupNumber',

            Key: Alto.LabelView.extend({
                classNames: ['key'],
                title: 'Group'
            }),

            Value: Alto.LabelView.extend({
                classNames: ['value'],
                titleBinding: 'parentView.parentView.parentView.controller.groupNumber'
            })
        }),

        Member: Alto.View.extend({
            classNames: ['member'],
            childViews: ['Key', 'Value'],
            isVisibleBinding: 'parentView.parentView.controller.memberNumber',

            Key: Alto.LabelView.extend({
                classNames: ['key'],
                title: 'Member'
            }),

            Value: Alto.LabelView.extend({
                classNames: ['value'],
                titleBinding: 'parentView.parentView.parentView.controller.memberNumber'
            })
        }),

        Policy: Alto.View.extend({
            classNames: ['policy'],
            childViews: ['Key', 'Value'],
            isVisibleBinding: 'parentView.parentView.controller.policyNumber',

            Key: Alto.LabelView.extend({
                classNames: ['key'],
                title: 'Policy'
            }),

            Value: Alto.LabelView.extend({
                classNames: ['value'],
                titleBinding: 'parentView.parentView.parentView.controller.policyNumber'
            })
        }),

        ExpirationDate: Alto.View.extend({
            classNames: ['expiration-date'],
            childViews: ['Key', 'Value'],
            isVisibleBinding: 'parentView.parentView.controller.expirationDate',

            Key: Alto.LabelView.extend({
                classNames: ['key'],
                title: 'Expiration Date'
            }),

            Value: Alto.LabelView.extend({
                classNames: ['value'],
                titleBinding: 'parentView.parentView.parentView.controller.expirationDate'
            })
        })
    })
})