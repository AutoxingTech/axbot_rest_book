module.exports = {
    base: "/axbot_rest_book/",
    markdown: {
        extendMarkdown: md => {
            md.set({ breaks: false })
            md.use(require('markdown-it-imsize'))
        }
    },
    themeConfig: {
        locales: {
            "/": {
                nav: [
                    // { text: '底盘JIRA', link: 'https://autoxing.atlassian.net/browse/RCSS' }
                ],
                // sidebar: [
                //     '/overview/overview',
                //     '/reference/reference'
                // ],
                // sidebar: {
                //     '/overview/': ["overview"],
                //     '/reference/': ["reference"]
                // },
                sidebar: [
                    {
                        title: 'Guide',
                        collapsable: false, // optional, defaults to true
                        sidebarDepth: 0,    // optional, defaults to 1
                        children: [
                            '/overview/getting_start',
                            '/guides/first_move',
                            '/guides/start_websocket',
                            '/guides/robot_admin',
                        ]
                    },
                    {
                        title: 'Reference',
                        collapsable: false,
                        children: [
                            '/reference/api_principals',
                            '/reference/maps',
                            '/reference/moves',
                            '/reference/current_map_and_pose',
                            '/reference/overlays',
                            '/reference/mappings',
                            '/reference/services',
                            '/reference/iot_devices',
                            '/reference/device',
                            // '/reference/videos',
                            // '/reference/recordings',
                            // '/reference/bags',
                            '/reference/robot_params',
                            '/reference/system_settings',
                            '/reference/app_store',
                            '/reference/hostnames',
                            '/reference/landmarks',
                            '/reference/websocket',
                            '/reference/submaps'
                        ],
                        sidebarDepth: 2
                    },
                    {
                        title: 'Other',
                        collapsable: false,
                        children: [
                            '/other/deprecations',
                            '/other/changelog'
                        ],
                        sidebarDepth: 2
                    }
                ],
                lastUpdated: 'Last Updated'
            },
            "/zh/": {
                nav: [],
                sidebar: [
                    {
                        title: '入门指南',
                        collapsable: false,
                        sidebarDepth: 0,
                        children: [
                            '/zh/overview/getting_start',
                            '/zh/guides/first_move',
                            '/zh/guides/start_websocket',
                            '/zh/guides/robot_admin',
                        ]
                    },
                    {
                        title: '参考手册',
                        collapsable: false,
                        children: [
                            '/zh/reference/api_principals',
                            '/zh/reference/maps',
                            '/zh/reference/moves',
                            '/zh/reference/current_map_and_pose',
                            '/zh/reference/overlays',
                            '/zh/reference/mappings',
                            '/zh/reference/services',
                            '/zh/reference/iot_devices',
                            '/zh/reference/device',
                            '/zh/reference/robot_params',
                            '/zh/reference/system_settings',
                            '/zh/reference/app_store',
                            '/zh/reference/hostnames',
                            '/zh/reference/landmarks',
                            '/zh/reference/websocket',
                            '/zh/reference/submaps'
                        ],
                        sidebarDepth: 2
                    },
                    {
                        title: '其他',
                        collapsable: false,
                        children: [
                            '/zh/other/deprecations',
                            '/zh/other/changelog'
                        ],
                        sidebarDepth: 2
                    }
                ],
                lastUpdated: '最后更新'
            }
        }
    },
    locales: {
        // The key is the path for the locale to be nested under.
        // As a special case, the default locale can use '/' as its path.
        '/': {
            lang: 'en-US', // this will be set as the lang attribute on <html>
            title: 'Autoxing REST API Book',
            description: "A complete guide to control Autoxing Tech's Robots with REST API",
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'Autoxing REST API Book',
            description: '景行慧动机器人 REST API 手册'
        },
    }
}