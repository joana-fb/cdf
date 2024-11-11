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
  '../dashboard/Dashboard.ext',
  'common-ui/util/URLEncoder',
  'pentaho/environment'
], function(DashboardExt, Encoder, environment) {

  return {

    getAnalyzer: function(path, callvar, parameters) {
      var url = environment.server.root + "api/repos/{0}/" + callvar;
      var encodedPath = Encoder.encodeRepositoryPath(DashboardExt.composePath(path));

      return Encoder.encode(url, encodedPath, parameters);
    }

  };

});
