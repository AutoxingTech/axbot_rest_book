module.exports = {
    base: "/axbot_rest_book/",
    markdown: {
        extendMarkdown: md => {
            md.set({ breaks: true })
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
                        title: '导引教程',
                        collapsable: false, // optional, defaults to true
                        sidebarDepth: 0,    // optional, defaults to 1
                        children: [
                            '/overview/getting_start',
                            '/guides/first_move',
                            '/guides/start_websocket',
                        ]
                    },
                    {
                        title: '参考手册',
                        collapsable: false,
                        children: [
                            '/reference/maps',
                            '/reference/moves',
                            '/reference/current_map_and_pose',
                            '/reference/services',
                            '/reference/bluetooth',
                            '/reference/device',
                            '/reference/videos',
                            '/reference/recordings',
                            '/reference/websocket',
                            '/overview/api_principals',
                            '/overview/migration'
                        ],
                        sidebarDepth: 2
                    }
                ],
                lastUpdated: 'Last Updated'
            },
            "/en/": {
                nav: [
                ],
                sidebar: [
                    {
                        title: 'Guide',
                        collapsable: false, // optional, defaults to true
                        sidebarDepth: 0,    // optional, defaults to 1
                        children: [
                            '/en/overview/getting_start',
                            '/en/guides/first_move',
                            '/en/guides/start_websocket',
                        ]
                    },
                    {
                        title: 'Reference',
                        collapsable: false,
                        children: [
                            '/en/reference/maps',
                            '/en/reference/moves',
                            '/en/reference/current_map_and_pose',
                            '/en/reference/services',
                            '/en/reference/bluetooth',
                            '/en/reference/device',
                            '/en/reference/videos',
                            '/en/reference/recordings',
                            '/en/reference/websocket',
                            '/en/overview/api_principals',
                            '/en/overview/migration'
                        ],
                        sidebarDepth: 2
                    }
                ],
                lastUpdated: 'Last Updated'
            }
        }
    },
    locales: {
        // The key is the path for the locale to be nested under.
        // As a special case, the default locale can use '/' as its path.
        '/': {
            lang: 'zh-CN',
            title: 'Autoxing REST API Book',
            description: '景行慧动机器人 REST API 手册'
        },
        '/en/': {
            lang: 'en-US', // this will be set as the lang attribute on <html>
            title: 'Autoxing REST API Book',
            description: "A complete guide to control Autoxing Tech's Robots with REST API",
        }
    }
}