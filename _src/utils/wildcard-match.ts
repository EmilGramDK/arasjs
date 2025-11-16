export type WildcardOptions = {
  caseSensitive?: boolean;
};

type CompiledAlt = {
  anchoredStart: boolean; // true if pattern does NOT start with '*'
  anchoredEnd: boolean; // true if pattern does NOT end with '*'
  segs: Array<string>; // segments between '*' wildcards
};

type CacheKey = `${string}::${0 | 1}`;
const compileCache = new Map<CacheKey, Array<CompiledAlt>>();

/**
 * Simple wildcard search with '*' and '|' operators.
 * Multiple alternatives can be separated by '|'.
 * Matching is case-insensitive by default; set `caseSensitive: true` to change.
 * @param input string to search
 * @param pattern string pattern to match against
 * @param opts optional settings for matching
 * @returns true if match, else false
 */
export function wildcardSearch(input: string, pattern: string, opts?: WildcardOptions): boolean {
  if (!pattern) return false;

  const caseSensitive = opts?.caseSensitive ?? false;
  const compiled = compile(pattern, caseSensitive);
  const hay = caseSensitive ? input : input.toLowerCase();

  for (const element of compiled) {
    if (matchCompiled(hay, element)) return true;
  }
  return false;
}

/**
 * Compiles a wildcard pattern into a matcher function.
 * @param pattern pattern string to compile
 * @param opts optional settings for matching
 * @returns a function that matches input strings against the pattern
 */
export function wildcardMatcher(
  pattern: string,
  opts?: WildcardOptions,
): (input: string) => boolean {
  if (!pattern) return () => false;
  const caseSensitive = opts?.caseSensitive ?? false;
  const compiled = compile(pattern, caseSensitive);
  return (input: string) => {
    if (!input) return false;
    const hay = caseSensitive ? input : input.toLowerCase();
    for (const element of compiled) {
      if (matchCompiled(hay, element)) return true;
    }
    return false;
  };
}

/**
 * Compiles a wildcard pattern into alternatives, with caching.
 * @param pattern pattern string to compile
 * @param caseSensitive whether the matching should be case sensitive
 * @returns an array of compiled alternatives
 */
function compile(pattern: string, caseSensitive: boolean): Array<CompiledAlt> {
  const key: CacheKey = `${pattern}::${caseSensitive ? 1 : 0}`;
  const cached = compileCache.get(key);
  if (cached) return cached;

  const altsRaw = pattern
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const alts: Array<CompiledAlt> = altsRaw.map((alt) => {
    const normalized = caseSensitive ? alt : alt.toLowerCase();
    const anchoredStart = normalized[0] !== "*";
    const anchoredEnd = normalized.at(-1) !== "*";

    const segs = normalized.split("*").filter((s) => s.length > 0);
    return { anchoredStart, anchoredEnd, segs };
  });

  compileCache.set(key, alts);
  return alts;
}

function isAllWildcards(alt: CompiledAlt): boolean {
  return alt.segs.length === 0 && (!alt.anchoredStart || !alt.anchoredEnd);
}

function isEmptyExact(alt: CompiledAlt): boolean {
  return alt.segs.length === 0 && alt.anchoredStart && alt.anchoredEnd;
}

function matchAnchoredStart(hay: string, first: string): number {
  return hay.startsWith(first) ? first.length : -1;
}

function matchUnanchoredStart(hay: string, first: string, from: number): number {
  const idx = hay.indexOf(first, from);
  return idx === -1 ? -1 : idx + first.length;
}

function advanceThroughMiddleSegments(
  hay: string,
  segs: Array<string>,
  startIndex: number,
): number {
  let pos = startIndex;
  // middle means segs[1]..segs[n-2]
  for (let i = 1; i < segs.length - 1; i++) {
    const next = segs[i];
    const idx = hay.indexOf(next, pos);
    if (idx === -1) return -1;
    pos = idx + next.length;
  }
  return pos;
}

function endsWithFrom(hay: string, suffix: string, minStart: number): boolean {
  const endIdx = hay.lastIndexOf(suffix);
  if (endIdx === -1) return false;
  return endIdx >= minStart && endIdx + suffix.length === hay.length;
}

function matchTrailing(hay: string, last: string, from: number): boolean {
  const idx = hay.indexOf(last, from);
  return idx !== -1;
}

/**
 * Matches a string against a compiled alternative.
 * @param hay string to search
 * @param alt compiled alternative to match against
 * @returns true if match, else false
 */
function matchCompiled(hay: string, alt: CompiledAlt): boolean {
  if (isAllWildcards(alt)) return true;
  if (isEmptyExact(alt)) return hay.length === 0;

  const { segs, anchoredStart, anchoredEnd } = alt;
  const first = segs[0];
  let pos = anchoredStart ? matchAnchoredStart(hay, first) : matchUnanchoredStart(hay, first, 0);

  if (pos === -1) return false;

  if (segs.length === 1) {
    return anchoredEnd ? hay.endsWith(first) : true;
  }

  pos = advanceThroughMiddleSegments(hay, segs, pos);
  if (pos === -1) return false;

  const last = segs.at(-1);
  if (!last) return false; // Ensure last is a string
  return anchoredEnd ? endsWithFrom(hay, last, pos) : matchTrailing(hay, last, pos);
}
