const mix = require('laravel-mix');

type Url = {
    url: string;
    template: string;
}

type Dimension = {
    width: number;
    height: number;
}

type Config = {
    enabled?: boolean;
    paths: {
        base: string;
        templates: string;
        suffix: string;
    };
    urls: Url[];
    options: {
        inline?: boolean;
        base?: string;
        html?: string;
        css?: string[];
        src?: string;
        target?: string | {
            html: string;
            css: string;
        };
        width: number;
        height: number;
        dimensions?: Dimension[];
        extract?: boolean;
        inlineImages?: boolean;
        assetPaths?: string[];
        maxImageFileSize?: number;
        penthouse: {
            timeout: number;
        }
    }
}

class Critical {
    private criticals: Config[] = [];

    private requiresReload: string = '';

    dependencies(): string[] {
        this.requiresReload = `Critical-Css-Webpack-Plugin has been installed. Please run "npm run dev" again.`;

        return ['critical-css-webpack-plugin'];
    }

    register(config: Config) {
        if (!config.urls || config.urls.length <= 0) {
            throw new Error(
                'You need to provide at least 1 valid url object containing both url and template keys.'
            );
        }

        const critical: Config = {...{
                enabled: mix.inProduction(),
                paths: {},
                urls: [],
                options: {
                    inline: false
                }
            }, ...config};

        this.criticals.push(critical);
    }

    webpackPlugins() {
        if (this.criticals.map((e: Config) => e.enabled).some(Boolean)) {
            const CriticalCssPlugin = require('critical-css-webpack-plugin');
            const plugins: Function[] = [];

            this.criticals.forEach((critical: Config) => {

                critical.enabled && critical.urls.forEach((template: Url) => {
                    const criticalSrc = critical.paths.base + template.url;
                    const criticalDest = `${critical.paths.templates + template.template + critical.paths.suffix}.css`;


                    if (criticalSrc.indexOf('amp_') !== -1) {
                        critical.options.width = 600;
                        critical.options.height = 19200;
                    }

                    plugins.push(new CriticalCssPlugin({...{
                        src: criticalSrc,
                        dest: criticalDest,
                        target: criticalDest,
                    }, ...critical.options}));
                });

            })

            return plugins;
        }
    }

}

mix.extend('criticalCss', new Critical());