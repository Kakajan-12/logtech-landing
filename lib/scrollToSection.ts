/**
 * Smoothly scrolls to the section with the given id if it exists on the
 * current page, and syncs the URL hash (dispatching `hashchange` so the
 * header's active-link state updates).
 *
 * Returns `false` when the section is not on this page, so the caller can
 * fall back to a regular navigation (e.g. to `/#id` on the home page).
 */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const { pathname, search, hash } = window.location;
  if (hash !== `#${id}`) {
    window.history.replaceState(
      window.history.state,
      "",
      `${pathname}${search}#${id}`,
    );
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
