"use client";

import * as React from "react";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import de from "i18n-iso-countries/langs/de.json";
import { Check, ChevronDown, Search } from "lucide-react";
import { useLocale } from "next-intl";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CountrySelectorProps } from "@/lib/types";

// Register locales
countries.registerLocale(en);
countries.registerLocale(de);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CountrySelector({ value, onChange, disabled, error }: CountrySelectorProps) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Get localized country names
  const countryList = React.useMemo(() => {
    // i18n-iso-countries expects 'en' or 'de', ensure we pass valid one or fallback to en
    const lang = (locale === "de" ? "de" : "en");
    const names = countries.getNames(lang, { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [locale]);

  // Filter countries
  const filteredCountries = React.useMemo(() => {
    if (!search) return countryList;
    const lowerSearch = search.toLowerCase();
    return countryList.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerSearch) ||
        c.code.toLowerCase().includes(lowerSearch)
    );
  }, [countryList, search]);

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset search when closed
  React.useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const selectedCountry = countryList.find((c) => c.code === value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-destructive focus:ring-destructive",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selectedCountry ? selectedCountry.name : "Select country..."}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-[300px] w-full min-w-[200px] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={searchInputRef}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto p-1">
            {filteredCountries.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No country found.
              </div>
            ) : (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => {
                    onChange(country.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    value === country.code && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="flex-1 truncate">{country.name}</span>
                  {value === country.code && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}