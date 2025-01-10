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
                            '/reference/websocket'
                        ],
                        sidebarDepth: 2
                    },
                    {
                        title: 'Articles',
                        collapsable: false,
                        children: [
                            '/articles/piece_by_piece_mapping',
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
            // "/chs/": {
            //     nav: [
            //     ],
            //     sidebar: [
            //         {
            //             title: '导引教程',
            //             collapsable: false, // optional, defaults to true
            //             sidebarDepth: 0,    // optional, defaults to 1
            //             children: [
            //                 '/chs/overview/getting_start',
            //                 '/chs/guides/first_move',
            //                 '/chs/guides/start_websocket',
            //             ]
            //         },
            //         {
            //             title: '参考手册',
            //             collapsable: false,
            //             children: [
            //                 '/chs/reference/api_principals',
            //                 '/chs/reference/maps',
            //                 '/chs/reference/moves',
            //                 '/chs/reference/current_map_and_pose',
            //                 '/chs/reference/mappings',
            //                 '/chs/reference/services',
            //                 '/chs/reference/bluetooth',
            //                 '/chs/reference/device',
            //                 '/chs/reference/videos',
            //                 '/chs/reference/recordings',
            //                 '/chs/reference/websocket'
            //             ],
            //             sidebarDepth: 2
            //         },
            //         {
            //             title: '其它',
            //             collapsable: false,
            //             children: [
            //                 '/chs/other/deprecations',
            //                 '/chs/other/changelog'
            //             ],
            //             sidebarDepth: 2
            //         }
            //     ],
            //     lastUpdated: '最后更新'
            // }
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
        // '/chs/': {
        //     lang: 'zh-CN',
        //     title: 'Autoxing REST API Book',
        //     description: '景行慧动机器人 REST API 手册'
        // },
    }
}