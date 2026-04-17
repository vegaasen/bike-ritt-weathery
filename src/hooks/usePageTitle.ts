import { useEffect } from "react";

const DEFAULT_TITLE = "Startstreken";

export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
