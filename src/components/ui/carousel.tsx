
import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselProps = {
  opts?: {
    loop?: boolean
    align?: "start" | "center" | "end"
  }
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselApi = {
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollTo: (index: number) => void
}

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement>
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts = { loop: false, align: "center" },
      setApi,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const carouselRef = React.useRef<HTMLDivElement>(null)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const updateScrollButtons = React.useCallback(() => {
      if (!carouselRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      const atStart = scrollLeft <= 1
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 1

      setCanScrollPrev(!atStart || (opts.loop ?? false))
      setCanScrollNext(!atEnd || (opts.loop ?? false))
    }, [opts.loop])

    const onScroll = React.useCallback(() => {
      if (!carouselRef.current) return
      updateScrollButtons()
      
      const { scrollLeft, clientWidth, children } = carouselRef.current
      const childWidth = clientWidth
      
      // Calculate the current index based on scroll position
      const newIndex = Math.round(scrollLeft / childWidth)
      if (newIndex !== selectedIndex && newIndex < children.length) {
        setSelectedIndex(newIndex)
      }
    }, [selectedIndex, updateScrollButtons])

    const scrollToItem = React.useCallback((index: number) => {
      if (!carouselRef.current || index < 0) return
      
      const container = carouselRef.current
      const childCount = container.children.length
      
      // Handle index bounds
      if (index >= childCount) {
        index = opts.loop ? 0 : childCount - 1
      }
      
      // Get child width for scrolling calculation
      const childWidth = container.clientWidth
      const scrollPosition = index * childWidth
      
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
      
      setSelectedIndex(index)
      updateScrollButtons()
    }, [opts.loop, updateScrollButtons])

    const scrollPrev = React.useCallback(() => {
      if (opts.loop && selectedIndex === 0 && carouselRef.current) {
        const childCount = carouselRef.current.children.length
        scrollToItem(childCount - 1)
      } else {
        scrollToItem(selectedIndex - 1)
      }
    }, [selectedIndex, scrollToItem, opts.loop])

    const scrollNext = React.useCallback(() => {
      if (carouselRef.current) {
        const childCount = carouselRef.current.children.length
        if (opts.loop && selectedIndex === childCount - 1) {
          scrollToItem(0)
        } else {
          scrollToItem(selectedIndex + 1)
        }
      }
    }, [selectedIndex, scrollToItem, opts.loop])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    // Setup resize observer to update buttons when container size changes
    React.useEffect(() => {
      const carousel = carouselRef.current
      if (!carousel) return

      const observer = new ResizeObserver(() => {
        updateScrollButtons()
      })

      observer.observe(carousel)
      return () => observer.disconnect()
    }, [updateScrollButtons])

    // Initialize scroll buttons and add scroll event listener
    React.useEffect(() => {
      const carousel = carouselRef.current
      if (!carousel) return

      updateScrollButtons()
      carousel.addEventListener('scroll', onScroll)
      
      return () => {
        carousel.removeEventListener('scroll', onScroll)
      }
    }, [onScroll, updateScrollButtons])

    // Create API object for external control
    const api = React.useMemo(() => ({
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      selectedIndex,
      scrollTo: scrollToItem,
    }), [scrollPrev, scrollNext, canScrollPrev, canScrollNext, selectedIndex, scrollToItem])

    // Expose API via the setApi prop if provided
    React.useEffect(() => {
      if (setApi) {
        setApi(api)
      }
    }, [api, setApi])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          scrollTo: scrollToItem,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          "scroll-smooth snap-x snap-mandatory",
          className
        )}
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full snap-center",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
