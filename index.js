/**
 * Module Dependencies
 */

var Regexp = require('path-to-regexp')
var assign = require('object-assign')

/**
 * Export `Enroute`
 */

module.exports = Enroute

/**
 * Create `enroute`
 *
 * @param {Object} routes
 * @return {Function}
 */

function Enroute (routes) {
  return function enroute (location, props) {
    if (!location) throw new Error('enroute requires a location')
    props = props || {}

    for (var route in routes) {
      var params = match(route, location)
      var fn = routes[route]

      if (params) {
        if (typeof fn !== 'function') return fn
        else return fn(params, props)
      }
    }

    return null
  }
}

/**
 * Check if this route matches `path`, if so
 * return a `params` object.
 *
 * @param {String} path
 * @return {Object}
 * @api private
 */

function match(path, pathname) {
  var keys = [];
  var regexp = Regexp(path, keys);
  var m = regexp.exec(pathname);
  var params = {};

  if (!m) return false;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];
    var val = 'string' == typeof m[i] ? decodeURIComponent(m[i]) : m[i];
    if (key) params[key.name] = val;
  }

  return params;
}
