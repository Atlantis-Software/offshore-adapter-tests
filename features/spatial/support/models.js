var Offshore = require(process.env.offshorePath || 'offshore');

module.exports = Offshore.Collection.extend({
  identity: 'geomodel',
  tableName: 'geomodelTable',
  connection: 'geoConnection',

  attributes: {
    name: {
      type: 'string'
    },
    prop1: {
      type: 'string',
      columnName: 'geomodelProp1'
    },
    marker: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'POINT'
      }
    },
    line: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'LINESTRING'
      }
    },
    shape: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'POLYGON'
      }
    },
    genericGeometry: {
      type: 'geometry',
      geometry: {
        nativeSrid: 4326,
        wktType: 'GEOMETRY'
      }
    }
  }
});
