import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ExpandableBlock } from './expandable-block'

// jsdom has no ResizeObserver and reports scrollHeight === 0, so the block
// never flips to `overflowing` on its own. Stub RO to fire immediately and
// force a tall scrollHeight on the observed node so the toggle mounts.
class TestResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(target: Element) {
    Object.defineProperty(target, 'scrollHeight', { configurable: true, value: 400 })
    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }

  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('ExpandableBlock', () => {
  it('lets horizontal scroll through and keeps the last line selectable', () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver)

    const { container } = render(
      <ExpandableBlock>
        <pre data-testid="content">{'const x = 1\n'.repeat(20)}</pre>
      </ExpandableBlock>
    )

    const inner = container.querySelector('[data-testid="content"]')!.parentElement!
    const toggle = screen.getByRole('button', { name: /expand|collapse/i })
    const fade = toggle.parentElement!

    // Inner container allows horizontal scroll so wide code gets a scrollbar:
    // platform overlay (`scrollbar-overlay`), not the always-on classic gutter.
    expect(inner.className).toContain('overflow-x-auto')
    expect(inner.className).toContain('scrollbar-overlay')

    // The full-width fade is a pure cue: it spans the bottom edge but must not
    // intercept pointer events, so the scrollbar drag and text selection on the
    // last line pass through to the content underneath.
    expect(fade.className).toContain('pointer-events-none')
    expect(fade.className).toContain('inset-x-0')

    // Only the compact toggle is clickable, and it is pinned to the right edge
    // rather than spanning the full width (the old bug).
    expect(toggle.className).toContain('pointer-events-auto')
    expect(toggle.className).toContain('w-9')
    expect(toggle.className).not.toContain('inset-x-0')
  })

  it('still toggles expanded state when the compact control is clicked', () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver)

    render(
      <ExpandableBlock>
        <pre data-testid="content">{'line\n'.repeat(20)}</pre>
      </ExpandableBlock>
    )

    const toggle = screen.getByRole('button', { name: 'Expand' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'Collapse' }).getAttribute('aria-expanded')).toBe('true')
  })

  it('renders bottom-right resize handle and updates height on drag', () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver)

    const { container } = render(
      <ExpandableBlock minHeight={80}>
        <pre data-testid="content">{'const y = 2\n'.repeat(20)}</pre>
      </ExpandableBlock>
    )

    const inner = container.querySelector('[data-testid="content"]')!.parentElement!
    const handle = container.querySelector('[data-slot="expandable-resize-handle"]') as HTMLElement
    expect(handle).not.toBeNull()
    expect(handle.getAttribute('aria-label')).toBe('Resize code block')

    // Mock initial height
    vi.spyOn(inner, 'getBoundingClientRect').mockReturnValue({
      bottom: 120,
      height: 120,
      left: 0,
      right: 500,
      top: 0,
      width: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    })

    // Drag to expand
    fireEvent.pointerDown(handle, { button: 0, clientY: 100, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientY: 250, pointerId: 1 })

    // startHeight (120) + deltaY (150) = 270px
    expect(inner.style.height).toBe('270px')
    expect(inner.style.maxHeight).toBe('none')

    fireEvent.pointerUp(handle, { pointerId: 1 })

    // Double click resets custom height
    fireEvent.doubleClick(handle)
    expect(inner.style.height).toBe('')
  })

  it('clamps custom height between minHeight and maxHeight', () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver)

    const { container } = render(
      <ExpandableBlock maxHeight={300} minHeight={100}>
        <pre data-testid="content">{'line\n'.repeat(20)}</pre>
      </ExpandableBlock>
    )

    const inner = container.querySelector('[data-testid="content"]')!.parentElement!
    const handle = container.querySelector('[data-slot="expandable-resize-handle"]') as HTMLElement

    vi.spyOn(inner, 'getBoundingClientRect').mockReturnValue({
      bottom: 120,
      height: 120,
      left: 0,
      right: 500,
      top: 0,
      width: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    })

    // Drag below minHeight (delta = -80 => 120 - 80 = 40 < minHeight 100)
    fireEvent.pointerDown(handle, { button: 0, clientY: 200, pointerId: 1 })
    fireEvent.pointerMove(handle, { clientY: 120, pointerId: 1 })
    expect(inner.style.height).toBe('100px')

    // Drag above maxHeight (delta = +300 => 120 + 300 = 420 > maxHeight 300)
    fireEvent.pointerMove(handle, { clientY: 500, pointerId: 1 })
    expect(inner.style.height).toBe('300px')

    fireEvent.pointerUp(handle, { pointerId: 1 })
  })

  it('respects resizable=false prop', () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver)

    const { container } = render(
      <ExpandableBlock resizable={false}>
        <pre data-testid="content">{'non-resizable\n'.repeat(10)}</pre>
      </ExpandableBlock>
    )

    const handle = container.querySelector('[data-slot="expandable-resize-handle"]')
    expect(handle).toBeNull()
  })
})
