'use client'

import { type ReactNode, type PointerEvent as ReactPointerEvent, useCallback, useRef, useState } from 'react'

import { useResizeObserver } from '@/hooks/use-resize-observer'
import { ChevronDown } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface ExpandableBlockProps {
  children: ReactNode
  className?: string
  /** Minimum height in pixels when manually resized (default: 64). */
  minHeight?: number
  /** Maximum height in pixels when manually resized (default: 85% of viewport height). */
  maxHeight?: number
  /** Enable manual vertical resizing via bottom-right drag handle (default: true). */
  resizable?: boolean
}

const DEFAULT_MIN_HEIGHT = 64

export function ExpandableBlock({
  children,
  className,
  minHeight = DEFAULT_MIN_HEIGHT,
  maxHeight,
  resizable = true
}: ExpandableBlockProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)
  const [customHeight, setCustomHeight] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartY = useRef(0)
  const dragStartHeight = useRef(0)

  // Measure inside ResizeObserver timing only (layout is clean there). A
  // synchronous mount-time scrollHeight read forces a reflow per instance,
  // and a tool-heavy transcript mounts dozens of these on a session switch.
  const measure = useCallback(() => {
    const el = innerRef.current

    if (el) {
      setOverflowing(el.scrollHeight > 121)
    }
  }, [])

  useResizeObserver(measure, innerRef)

  const onHandlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const target = event.currentTarget

    try {
      target.setPointerCapture(event.pointerId)
    } catch {
      // Ignored if pointer capture is unavailable
    }

    const currentHeight = innerRef.current?.getBoundingClientRect().height ?? 120

    dragStartY.current = event.clientY
    dragStartHeight.current = currentHeight
    setIsDragging(true)
  }, [])

  const onHandlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) {
        return
      }

      event.preventDefault()

      const deltaY = event.clientY - dragStartY.current
      const resolvedMax =
        maxHeight ?? (typeof window !== 'undefined' ? Math.max(minHeight, Math.round(window.innerHeight * 0.85)) : 1000)
      const nextHeight = Math.max(minHeight, Math.min(resolvedMax, dragStartHeight.current + deltaY))

      setCustomHeight(nextHeight)
    },
    [isDragging, maxHeight, minHeight]
  )

  const onHandlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) {
        return
      }

      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {
        // Ignored if pointer capture is unavailable
      }

      setIsDragging(false)
    },
    [isDragging]
  )

  const onHandleDoubleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setCustomHeight(null)
  }, [])

  const handleToggleExpand = useCallback(() => {
    setCustomHeight(null)
    setExpanded(v => !v)
  }, [])

  const style = customHeight !== null ? { height: `${customHeight}px`, maxHeight: 'none' } : undefined

  return (
    <div className="group/expandable relative">
      <div
        className={cn(
          // `scrollbar-overlay` opts out of the app-wide classic thin gutters so
          // this scroller keeps platform overlay bars (no always-on track).
          'scrollbar-overlay overflow-y-auto overflow-x-auto',
          customHeight === null && (expanded ? 'max-h-[40dvh]' : 'max-h-[7.5rem]'),
          className
        )}
        ref={innerRef}
        style={style}
      >
        {children}
      </div>
      {overflowing && customHeight === null && (
        // The fade is a pure overflow cue and must not intercept pointer events:
        // it spans the full bottom edge (over the horizontal scrollbar of a wide
        // code block AND the block's last line), so making it clickable killed
        // both sideways scrolling and text selection. Keep the fade
        // `pointer-events-none` and pin the only clickable target — a compact
        // toggle — to the right edge, clear of the draggable scrollbar track.
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-7 items-center justify-end bg-linear-to-t from-[var(--expandable-fade-from,var(--ui-chat-surface-background))] to-transparent pe-1">
          <button
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            className="pointer-events-auto flex h-7 w-9 cursor-pointer items-end justify-center pb-1 text-muted-foreground/70 transition-colors hover:text-foreground"
            onClick={handleToggleExpand}
            type="button"
          >
            <ChevronDown className={cn('size-3.5 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      )}
      {resizable && (
        <div
          aria-label="Resize code block"
          className={cn(
            'group/resize pointer-events-auto absolute bottom-0 right-0 z-10 flex size-4 cursor-se-resize items-end justify-end p-0.5 opacity-40 transition-opacity select-none hover:opacity-100 focus-visible:opacity-100 group-hover/expandable:opacity-80',
            isDragging && 'opacity-100'
          )}
          data-slot="expandable-resize-handle"
          onDoubleClick={onHandleDoubleClick}
          onPointerCancel={onHandlePointerUp}
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          role="separator"
          tabIndex={0}
          title="Drag to resize height (double-click to reset)"
        >
          <svg
            aria-hidden="true"
            className="size-2.5 text-muted-foreground transition-colors group-hover/resize:text-foreground"
            fill="none"
            viewBox="0 0 10 10"
          >
            <path
              d="M8.5 1.5L1.5 8.5M8.5 4.5L4.5 8.5M8.5 7.5L7.5 8.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.25"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
