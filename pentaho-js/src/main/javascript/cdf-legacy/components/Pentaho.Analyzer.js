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


/*
 *
 * Includes all components relating to Analyzer iFrame
 * Hitachi Vantara-owned technologies.
 *
 */

 var AnalyzerComponent = BaseComponent.extend({

    update: function() {
        this.clear();
        var options = this.getOptions();

        var callVar = this.isEditMode() ? "editor" : "viewer";

        $.extend( options, { ts: new Date().getTime() } );
        var url = wd.cdf.endpoints.getAnalyzer({
            solution: this.solution,
            path: this.path,
            action: this.action
        }, callVar, options);

        var iframe = this.generateIframe( url );
        $( "#" + this.htmlObject ).html( iframe );

    },

    getOptions: function() {
        var myself = this;
        var options = {
            command: myself.command == undefined ? "open" : myself.command,
            showFieldList: myself.showFieldList == undefined ? false : myself.showFieldList,
            showRepositoryButtons: myself.showRepositoryButtons == undefined ? false : myself.showRepositoryButtons,
            frameless: myself.frameless == undefined ? false : myself.frameless
        };
        myself.dateFormats = myself.dateFormats == undefined ? {} : myself.dateFormats;
        // process params and update options
        $.map(myself.parameters, function(k) {
            options[k[0]] = Dashboards.getParameterValue(k[1]);
            if(myself.dateFormats[k[0]]) {
                var formatedDate = moment(options[k[0]]).format(myself.dateFormats[k[0]]);
                if(formatedDate !== 'Invalid date') {
                    options[k[0]] = formatedDate;
                }
            }
        });
        return options;
    },

    isEditMode: function() {
        if ( this.viewOnly != undefined ) {
            return !this.viewOnly || this.editMode;
        } else {
            return this.editMode;
        }
    },

    generateIframe: function(url) {
        return "<iframe id ='iframe_" + this.htmlObject + "' "
                + "style='height:100%;width:100%;border:0' "
                + "frameborder='0' src='" + url + "'/>";
    }

}); // AnalyzerComponent

var ExecuteAnalyzerComponent = AnalyzerComponent.extend({

    update: function() {
        // 2 modes of working; if it's a div, create a button inside it
        var $html = $("#" + this.htmlObject);

        if (!$html.length) return;

        if ($.inArray($html[0].tagName.toUpperCase(), ["SPAN", "DIV"]) > -1) {
            // create a button
            $html = $("<button/>").appendTo($html.empty());

            if ($html[0].tagName === "DIV") {
                $html.wrap("<span/>");
            }

            if (this.label != null) {
                $html.text(this.label);
            }

            $html.button();
        }

        $html.unbind("click"); // Needed to avoid multiple binds due to multiple updates(ex:component with listeners)

        var myself = this;
        $html.bind("click", function() {
            var success = typeof myself.preChange === 'function' ? myself.preChange() : true ;
            if (success) {
                myself.executeAnalyzerComponent();
            }
            if (typeof myself.postChange === 'function') {
              myself.postChange();
            }
        });
    },

    executeAnalyzerComponent: function() {
        var callVar = this.isEditMode() ? "editor" : "viewer";
        var parameters = this.getOptions();

        parameters.ts = new Date().getTime();

        var pathOptions = {
           solution: this.solution,
           path: this.path,
           action: this.action
        };

        $.fancybox.open({
                src: wd.cdf.endpoints.getAnalyzer( pathOptions, callVar, parameters ),
                type: "iframe",
                baseClass: "cdf-fancybox cdf-fancybox-iframe",
                btnTpl: {
                    smallBtn:
                        '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="close"></button>'
                }
            },
            {
                toolbar  : false,
                smallBtn : true,
                iframe:{
                    preload: false,
                    css: {
                        width: $(window).width(),
                        height: $(window).height() - 50,
                        "max-width": "100%",
                        "max-height": "100%"
                    }
                }
            });
    }
}); // ExecuteAnalyzerComponent
