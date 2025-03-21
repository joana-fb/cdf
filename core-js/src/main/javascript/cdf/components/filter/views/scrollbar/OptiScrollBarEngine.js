/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2024 by Hitachi Vantara, LLC : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2029-07-20
 ******************************************************************************/

/**
 * @summary OptiScrollBar implementation of ScrollBarHandler
 * @description OptiScrollBar implementation of ScrollBarHandler
 */
define([
  './AbstractScrollBarHandler',
  '../../../../lib/jquery'
], function(AbstractScrollBarHandler, $) {
  return AbstractScrollBarHandler.extend({
    scrollbar: null,
    constructor: function(view) {
      this.scrollbar = view.$(view.config.view.slots.children)
        .addClass('optiscroll-content').parent()
        .addClass('optiscroll').optiscroll()
        .off('scrollreachbottom')
        .on('scrollreachbottom', function(event) {
          return view.trigger('scroll:reached:bottom', view.model, event);
        }).off('scrollreachtop')
        .on('scrollreachtop', function(event) {
          return view.trigger('scroll:reached:top', view.model, event);
        }).data('optiscroll');
    },

    scrollToPosition: function(position) {
      this.scrollbar.scrollIntoView(position);
    }
  });
});