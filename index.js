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
    var params = {}

    for (var route in routes) {
      var m = match(route, params, location)
      var fn = routes[route]

      if (m) {
        if (typeof fn !== 'function') return fn
        else return fn(params, props)
      }
    }

    return null
  }
}

/**
 * Check if this route matches `path`, if so
 * populate `params`.
 *
 * @param {String} path
 * @param {Object} params
 * @return {Boolean}
 * @api private
 */

function match(path, params, pathname) {
  var keys = [];
  var regexp = Regexp(path, keys);
  var m = regexp.exec(pathname);

  if (!m) return false;
  else if (!params) return true;

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];
    var val = 'string' == typeof m[i] ? decodeURIComponent(m[i]) : m[i];
    if (key) params[key.name] = val;
  }

  return true;
}
