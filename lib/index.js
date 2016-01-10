'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Jsmoo = function () {
  _createClass(Jsmoo, null, [{
    key: 'has',
    value: function has(attrs) {
      var _this = this;

      Object.keys(attrs).forEach(function (attr) {
        Object.defineProperty(_this.prototype, attr, {
          value: attrs[attr].default,
          writable: attrs[attr].is === 'ro' ? false : true,
          enumerable: true
        });
      });
    }
  }]);

  function Jsmoo(attrs) {
    var _this2 = this;

    _classCallCheck(this, Jsmoo);

    if (typeof this.beforeInitialize === 'function') attrs = this.beforeInitialize(attrs);
    Object.keys(attrs).forEach(function (attr) {
      return _this2[attr] = attrs[attr];
    });
    if (typeof this.afterInitialize === 'function') this.afterInitialize();
  }

  return Jsmoo;
}();

exports.default = Jsmoo;