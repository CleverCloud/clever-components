import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from '@playwright/test'
import { argosScreenshot } from '@argos-ci/playwright'

type StoryIndex = {
  entries: Record<string, { id: string; title: string; name: string; type: string }>
}

const indexPath = fileURLToPath(new URL('../storybook-static/index.json', import.meta.url))
const index: StoryIndex = JSON.parse(readFileSync(indexPath, 'utf-8'))

const only = process.env.ARGOS_ONLY?.split(',').map((s) => s.trim())

const stories = Object.values(index.entries).filter(
  (entry) => entry.type === 'story' && (!only || only.includes(entry.id)),
)

for (const story of stories) {
  test(`${story.title} › ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`)

    // Some stories render via portals and leave #storybook-root empty, so
    // wait on Storybook's own preview lifecycle instead of DOM heuristics.
    await page.waitForFunction(() => {
      const phase = (
        window as unknown as {
          __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } }
        }
      ).__STORYBOOK_PREVIEW__?.currentRender?.phase
      return phase === 'completed' || phase === 'finished'
    })

    const storyParameters = await page.evaluate(() => {
      return (
        (
          window as unknown as {
            __STORYBOOK_PREVIEW__?: {
              currentRender?: {
                story?: {
                  parameters?: {
                    chromatic?: { delay?: number; disableSnapshot?: boolean }
                  }
                }
              }
            }
          }
        ).__STORYBOOK_PREVIEW__?.currentRender?.story?.parameters?.chromatic ?? {}
      )
    })

    test.skip(
      storyParameters.disableSnapshot === true,
      'story opts out of snapshots (chromatic parameter)',
    )

    if (typeof storyParameters.delay === 'number' && storyParameters.delay > 0) {
      await page.waitForTimeout(storyParameters.delay)
    }

    // Scrollable lists may settle on a non-deterministic offset: pin every
    // scroll position before capturing.
    await page.evaluate(() => {
      for (const element of Array.from(document.querySelectorAll('*'))) {
        if (element.scrollLeft !== 0) element.scrollLeft = 0
        if (element.scrollTop !== 0) element.scrollTop = 0
      }
    })

    // Spinners and skeletons legitimately keep aria-busy forever.
    const isLoadingState = /load(ing|er)|skeleton|spinner|progress/i.test(
      `${story.title} ${story.name}`,
    )

    await argosScreenshot(page, story.id, {
      stabilize: isLoadingState ? { waitForAriaBusy: false } : true,
    })
  })
}
