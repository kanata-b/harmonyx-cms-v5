"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = "blur",
  blurDataURL,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const shouldLoad = priority || isInView;

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {shouldLoad && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      {!isLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
    </div>
  );
}
