module.exports = {
    title: 'Autoxing REST API Book',
    description: "A complete guide to control Autoxing Tech's Robots with REST API",
    base: "/",
    markdown: {
        extendMarkdown: md => {
            md.set({ breaks: true })
            md.use(require('markdown-it-imsize'))
        }
    },
    themeConfig: {
        nav: [
            { text: '底盘JIRA', link: 'https://autoxing.atlassian.net/browse/RCSS' }
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
                title: '概览',   // required
                collapsable: false, // optional, defaults to true
                sidebarDepth: 0,    // optional, defaults to 1
                children: [
                    '/overview/getting_start',
                    '/overview/api_principals',
                    '/overview/first_move',
                    '/overview/start_websocket',
                ]
            },
            {
                title: '参考手册',
                collapsable: false,
                children: [
                    '/reference/maps',
                    '/reference/moves',
                ],
                sidebarDepth: 2
            }
        ],
        lastUpdated: 'Last Updated'
    }
}