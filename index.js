const mix = require('laravel-mix');
class Critical {
    criticals = [];
    requiresReload = '';
    dependencies() {
        this.requiresReload = `Critical-Css-Webpack-Plugin has been installed. Please run "npm run dev" again.`;
        return ['critical-css-webpack-plugin'];
    }
    register(config) {
        if (!config.urls || config.urls.length <= 0) {
            throw new Error('You need to provide at least 1 valid url object containing both url and template keys.');
        }
        const critical = { ...{
                enabled: mix.inProduction(),
                paths: {},
                urls: [],
                options: {
                    inline: false
                }
            }, ...config };
        this.criticals.push(critical);
    }
    webpackPlugins() {
        if (this.criticals.map((e) => e.enabled).some(Boolean)) {
            const CriticalCssPlugin = require('critical-css-webpack-plugin');
            const plugins = [];
            this.criticals.forEach((critical) => {
                critical.enabled && critical.urls.forEach((template) => {
                    const criticalSrc = critical.paths.base + template.url;
                    const criticalDest = `${critical.paths.templates + template.template + critical.paths.suffix}.css`;
                    if (criticalSrc.indexOf('amp_') !== -1) {
                        critical.options.width = 600;
                        critical.options.height = 19200;
                    }
                    plugins.push(new CriticalCssPlugin({ ...{
                            src: criticalSrc,
                            dest: criticalDest,
                            target: criticalDest,
                        }, ...critical.options }));
                });
            });
            return plugins;
        }
    }
}
mix.extend('criticalCss', new Critical());
