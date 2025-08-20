"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export function ThemeToggle({
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const t = useTranslations("ThemeToggle");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const ThemeButton = (
    <Button
      variant="ghost"
      size={showLabel ? "default" : "icon"}
      onClick={toggleTheme}
      className={`${showLabel ? "w-full justify-start" : ""} ${className || ""}`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {showLabel && (
        <span className="ml-2">
          {theme === "light" ? t("switch_to_dark") : t("switch_to_light")}
        </span>
      )}
      <span className="sr-only">{t("toggle_theme")}</span>
    </Button>
  );

  if (showLabel) {
    return ThemeButton;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{ThemeButton}</TooltipTrigger>
        <TooltipContent>
          <p>Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
