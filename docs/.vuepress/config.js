import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import anchor from 'markdown-it-anchor'
import imsize from 'markdown-it-imsize'

export default defineUserConfig({
  base: "/axbot_rest_book/",
  bundler: viteBundler(),
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
              '/reference/services.md',
              '/reference/iot_devices.md',
              '/reference/device.md',
              '/reference/robot_params.md',
              '/reference/system_settings.md',
              '/reference/app_store.md',
              '/reference/hostnames.md',
              '/reference/landmarks.md',
              '/reference/websocket.md',
              '/reference/submaps.md'
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
              '/zh/reference/services.md',
              '/zh/reference/iot_devices.md',
              '/zh/reference/device.md',
              '/zh/reference/robot_params.md',
              '/zh/reference/system_settings.md',
              '/zh/reference/app_store.md',
              '/zh/reference/hostnames.md',
              '/zh/reference/landmarks.md',
              '/zh/reference/websocket.md',
              '/zh/reference/submaps.md'
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
    md.use(imsize)
    md.use(anchor, {
      permalink: false,
      slugify: (s) => {
        const match = /\{#([a-z0-9-]+)\}$/i.exec(s);
        if (match) {
          return match[1];
        }
        return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));
      }
    })
  },
})
