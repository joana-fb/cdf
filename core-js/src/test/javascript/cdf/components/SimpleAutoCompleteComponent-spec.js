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


define([
  "cdf/Dashboard.Clean",
  "cdf/components/SimpleAutoCompleteComponent"
], function(Dashboard, SimpleAutoCompleteComponent) {

  /**
   * ## The Simple Auto Complete Component
   */
  describe("The SimpleAutoComplete Component #", function() {

    var dashboard = new Dashboard();
    
    dashboard.addParameter("param1", "value1");

    dashboard.addDataSource("simpleAutoCompQuery", {
      dataAccessId: "dataAccessTestId",
      path: "/fake/file.cda",
    });

    dashboard.init();

    var simpleAutoCompleteComponent = new SimpleAutoCompleteComponent({
      name: "simpleAC",
      type: "SimpleAutoComplete",
      htmlObject: "sampleObjectSimpleAC",
      searchParam: "searching",
      parameters: [["arg1", "param1"]],
      minTextLength: 2,
      queryDefinition: {
        dataSource: "simpleAutoCompQuery",
        showValue: true
      },
      executeAtStart: true
    });

    dashboard.addComponent(simpleAutoCompleteComponent);

    /**
     * ## The Simple Auto Complete Component # allows a dashboard to execute update
     */
    it("allows a dashboard to execute update", function(done) {
      spyOn(simpleAutoCompleteComponent, 'update').and.callThrough();

      // listen to cdf:postExecution event
      simpleAutoCompleteComponent.once("cdf:postExecution", function() {
        expect(simpleAutoCompleteComponent.update).toHaveBeenCalled();
        done();
      });

      dashboard.update(simpleAutoCompleteComponent);
    });

    /**
     * ## The Simple Auto Complete Component # fetchData called
     */
    it("fetchData called", function() {
      spyOn(simpleAutoCompleteComponent, 'handleQuery').and.callFake(function() { return ""; });
      spyOn(simpleAutoCompleteComponent.query, 'fetchData').and.callFake(function() {});
      spyOn(simpleAutoCompleteComponent.query, 'setSearchPattern');
      var searchValue = "Do";

      simpleAutoCompleteComponent.triggerQuery(searchValue, function() {});
      expect(simpleAutoCompleteComponent.query.fetchData).toHaveBeenCalledWith([["arg1", "param1"], ["searching", searchValue]], "");
      expect(simpleAutoCompleteComponent.query.setSearchPattern).not.toHaveBeenCalled();

      simpleAutoCompleteComponent.searchParam = undefined;
      simpleAutoCompleteComponent.triggerQuery(searchValue, function() {});
      expect(simpleAutoCompleteComponent.query.fetchData).toHaveBeenCalledWith([["arg1", "param1"]], "");
      expect(simpleAutoCompleteComponent.query.setSearchPattern).toHaveBeenCalledWith(searchValue);

    });

    /**
     * ## The Simple Auto Complete Component # fetchData not called
     */
    it("fetchData not called", function() {
      spyOn(simpleAutoCompleteComponent, 'handleQuery').and.callFake(function() { return ""; });
      spyOn(simpleAutoCompleteComponent.query, 'fetchData').and.callFake(function() {});
      var searchValue = "D";

      simpleAutoCompleteComponent.triggerQuery(searchValue, function() {});
      expect(simpleAutoCompleteComponent.query.fetchData).not.toHaveBeenCalled();
    });

    /**
     * ## The Simple Auto Complete Component # getList return values
     */
    it("getList return values", function() {
      var data = {
        "metadata": ["Sales"],
        "resultset": [["AV Stores, Co.", "157807.94"],
                      ["Anna's Decorations, Ltd", "153996.98"],
                      ["Auto Canal+ Petit", "93170.66"],
                      ["Alpha Cognac", "70488.49"],
                      ["Auto Associés & Cie.", "64834.01"],
                      ["Australian Collectables, Ltd", "64591.14"],
                      ["Australian Gift Network, Co", "59469.12"],
                      ["Auto-Moto Classics Inc.", "26479.02"],
                      ["Atelier graphique", "24179.96"]]
      };
      var result = ["AV Stores, Co.",
                    "Anna's Decorations, Ltd",
                    "Auto Canal+ Petit",
                    "Alpha Cognac",
                    "Auto Associés & Cie.",
                    "Australian Collectables, Ltd",
                    "Australian Gift Network, Co",
                    "Auto-Moto Classics Inc.",
                    "Atelier graphique"];

      var values = simpleAutoCompleteComponent.getList(data);
      for(var i = 0, len = data.resultset.length; i < len; i++) {
        expect(values[i]).toBe(data.resultset[i][0]);
      }
    });
  });
});
