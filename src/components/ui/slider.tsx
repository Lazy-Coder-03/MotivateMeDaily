
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, ...props }, ref) => {
  // Determine the initial array of values to decide how many thumbs to render.
  // Use `value` if the component is controlled, otherwise `defaultValue`.
  // Fallback to a single thumb with value 0 if neither is provided (though typically one should be).
  const currentOrInitialValue = value ?? defaultValue ?? [0];
  // Ensure `thumbsValueProvider` is always an array for mapping.
  const thumbsValueProvider = Array.isArray(currentOrInitialValue) ? currentOrInitialValue : [currentOrInitialValue];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      value={value} // Pass the original value prop for controlled behavior
      defaultValue={defaultValue} // Pass the original defaultValue prop
      {...props} // Pass other props like min, max, step, onValueChange
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {/* Render a <SliderPrimitive.Thumb /> for each item in thumbsValueProvider. */}
      {/* This ensures that for range sliders (where value/defaultValue is an array), */}
      {/* the correct number of thumbs are explicitly rendered. */}
      {thumbsValueProvider.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index} // React key for list rendering
          className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          // Radix's <SliderPrimitive.Thumb />'s position and value are controlled by the
          // <SliderPrimitive.Root /> component based on its overall value/defaultValue array.
        />
      ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
