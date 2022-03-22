var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var mix = require('laravel-mix');
var Critical = /** @class */ (function () {
    function Critical() {
        this.criticals = [];
        this.requiresReload = '';
    }
    Critical.prototype.dependencies = function () {
        this.requiresReload = "Critical-Css-Webpack-Plugin has been installed. Please run \"npm run dev\" again.";
        return ['critical-css-webpack-plugin'];
    };
    Critical.prototype.register = function (config) {
        if (!config.urls || config.urls.length <= 0) {
            throw new Error('You need to provide at least 1 valid url object containing both url and template keys.');
        }
        var critical = __assign({
            enabled: mix.inProduction(),
            paths: {},
            urls: [],
            options: {
                inline: false
            }
        }, config);
        this.criticals.push(critical);
    };
    Critical.prototype.webpackPlugins = function () {
        if (this.criticals.map(function (e) { return e.enabled; }).some(Boolean)) {
            var CriticalCssPlugin_1 = require('critical-css-webpack-plugin');
            var plugins_1 = [];
            this.criticals.forEach(function (critical) {
                critical.enabled && critical.urls.forEach(function (template) {
                    var criticalSrc = critical.paths.base + template.url;
                    var criticalDest = "".concat(critical.paths.templates + template.template + critical.paths.suffix, ".css");
                    if (criticalSrc.indexOf('amp_') !== -1) {
                        critical.options.width = 600;
                        critical.options.height = 19200;
                    }
                    plugins_1.push(new CriticalCssPlugin_1(__assign({
                        src: criticalSrc,
                        dest: criticalDest,
                        target: criticalDest
                    }, critical.options)));
                });
            });
            return plugins_1;
        }
    };
    return Critical;
}());
mix.extend('criticalCss', new Critical());
