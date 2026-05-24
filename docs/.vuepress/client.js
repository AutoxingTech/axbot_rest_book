import { defineClientConfig, useRoute } from 'vuepress/client'
import { onMounted, watch } from 'vue'

export default defineClientConfig({
    setup() {
        const route = useRoute()

        const scrollToHash = () => {
            const hash = decodeURIComponent(window.location.hash)
            if (hash) {
                // Wait for next tick to ensure DOM is updated
                setTimeout(() => {
                    const element = document.querySelector(hash)
                    if (element) {
                        element.scrollIntoView()
                    }
                }, 500) // Small delay to handle most initial renders
            }
        }

        onMounted(() => {
            // Handle initial load if image loading causes offset
            window.addEventListener('load', () => {
                if (window.location.hash) {
                    scrollToHash()
                }
            })
        })

        // Re-scroll when hash changes (e.g., clicking search result)
        watch(
            () => route.hash,
            (newHash) => {
                if (newHash) {
                    // Additional delay for image heavy pages
                    setTimeout(scrollToHash, 300)
                }
            }
        )
    },
})
