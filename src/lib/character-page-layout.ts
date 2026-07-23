/** Shared inner width for character detail sections — matches home + desktop side rails. */
export function characterPageContainerClass(extra = ""): string {
  return `mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6${extra ? ` ${extra}` : ""}`;
}
