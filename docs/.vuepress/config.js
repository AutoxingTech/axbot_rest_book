import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { searchPlugin } from '@vuepress/plugin-search'
import anchor from 'markdown-it-anchor'
import imsize from 'markdown-it-imsize'
import attrs from 'markdown-it-attrs'
import Prism from 'prismjs'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-json5.js'

// Prism ships no jsonc grammar; alias it to json5, which also allows comments and trailing commas.
Prism.languages.jsonc = Prism.languages.json5

export default defineUserConfig({
    base: "/axbot_rest_book/",
    bundler: viteBundler(),
    plugins: [
        searchPlugin({
            locales: {
                '/': {
                    placeholder: 'Search',
                },
                '/zh/': {
                    placeholder: '搜索',
                },
            },
        }),
    ],
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Autoxing REST API Book',
            description: "A complete guide to control Autoxing Tech's Robots with REST API",
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'Autoxing REST API Book',
            description: '景行慧动机器人 REST API 手册'
        },
    },
    theme: defaultTheme({
        repo: 'AutoxingTech/axbot_rest_book',
        docsRepo: 'AutoxingTech/axbot_rest_book',
        docsBranch: 'main',
        editLink: true,
        locales: {
            "/": {
                navbar: [],
                sidebar: [
                    {
                        text: 'Guide',
                        collapsible: false,
                        children: [
                            '/overview/getting_start.md',
                            '/guides/first_move.md',
                            '/guides/start_websocket.md',
                            '/guides/robot_admin.md',
                        ]
                    },
                    {
                        text: 'Reference',
                        collapsible: false,
                        children: [
                            '/reference/api_principals.md',
                            '/reference/maps.md',
                            '/reference/moves.md',
                            '/reference/current_map_and_pose.md',
                            '/reference/overlays.md',
                            '/reference/mappings.md',
                            '/reference/iot_devices.md',
                            '/reference/device.md',
                            '/reference/robot_params.md',
                            '/reference/system_settings.md',
                            '/reference/app_store.md',
                            '/reference/hostnames.md',
                            '/reference/landmarks.md',
                            '/reference/submaps.md'
                        ],
                    },
                    {
                        text: 'Services',
                        collapsible: false,
                        children: [
                            '/reference/services.md',
                            '/reference/services-motion.md',
                            '/reference/services-localization.md',
                            '/reference/services-mapping.md',
                            '/reference/services-cargo.md',
                            '/reference/services-perception.md',
                            '/reference/services-calibration.md',
                            '/reference/services-network.md',
                            '/reference/services-system.md'
                        ],
                    },
                    {
                        text: 'WebSocket',
                        collapsible: false,
                        children: [
                            '/reference/websocket.md',
                            '/reference/websocket-localization.md',
                            '/reference/websocket-mapping.md',
                            '/reference/websocket-navigation.md',
                            '/reference/websocket-chassis.md',
                            '/reference/websocket-cargo.md',
                            '/reference/websocket-perception.md',
                            '/reference/websocket-environment.md',
                            '/reference/websocket-system.md'
                        ],
                    },
                    {
                        text: 'Other',
                        collapsible: false,
                        children: [
                            '/other/deprecations.md',
                            '/other/changelog.md'
                        ],
                    }
                ],
                lastUpdated: true,
                lastUpdatedText: 'Last Updated'
            },
            "/zh/": {
                navbar: [],
                sidebar: [
                    {
                        text: '入门指南',
                        collapsible: false,
                        children: [
                            '/zh/overview/getting_start.md',
                            '/zh/guides/first_move.md',
                            '/zh/guides/start_websocket.md',
                            '/zh/guides/robot_admin.md',
                        ]
                    },
                    {
                        text: '参考手册',
                        collapsible: false,
                        children: [
                            '/zh/reference/api_principals.md',
                            '/zh/reference/maps.md',
                            '/zh/reference/moves.md',
                            '/zh/reference/current_map_and_pose.md',
                            '/zh/reference/overlays.md',
                            '/zh/reference/mappings.md',
                            '/zh/reference/iot_devices.md',
                            '/zh/reference/device.md',
                            '/zh/reference/robot_params.md',
                            '/zh/reference/system_settings.md',
                            '/zh/reference/app_store.md',
                            '/zh/reference/hostnames.md',
                            '/zh/reference/landmarks.md',
                            '/zh/reference/submaps.md'
                        ],
                    },
                    {
                        text: '服务',
                        collapsible: false,
                        children: [
                            '/zh/reference/services.md',
                            '/zh/reference/services-motion.md',
                            '/zh/reference/services-localization.md',
                            '/zh/reference/services-mapping.md',
                            '/zh/reference/services-cargo.md',
                            '/zh/reference/services-perception.md',
                            '/zh/reference/services-calibration.md',
                            '/zh/reference/services-network.md',
                            '/zh/reference/services-system.md'
                        ],
                    },
                    {
                        text: 'WebSocket 话题',
                        collapsible: false,
                        children: [
                            '/zh/reference/websocket.md',
                            '/zh/reference/websocket-localization.md',
                            '/zh/reference/websocket-mapping.md',
                            '/zh/reference/websocket-navigation.md',
                            '/zh/reference/websocket-chassis.md',
                            '/zh/reference/websocket-cargo.md',
                            '/zh/reference/websocket-perception.md',
                            '/zh/reference/websocket-environment.md',
                            '/zh/reference/websocket-system.md'
                        ],
                    },
                    {
                        text: '其他',
                        collapsible: false,
                        children: [
                            '/zh/other/deprecations.md',
                            '/zh/other/changelog.md'
                        ],
                    }
                ],
                lastUpdated: true,
                lastUpdatedText: '最后更新'
            }
        }
    }),
    extendsMarkdown: (md) => {
        md.set({ breaks: false })
        md.use(attrs)
        md.use(imsize)
        md.use(anchor, {
            permalink: false
        })
    },
})
