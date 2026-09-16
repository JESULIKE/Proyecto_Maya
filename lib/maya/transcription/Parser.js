/**
 * TranscriptionParser
 *
 * Parses raw Maya transcription input into segments.
 * The `-` character is a word/unit separator (preserved in original input)
 * but apostrophes/glottals are NOT separators — `t'o` is distinct from `to`.
 *
 * All methods are pure (no side effects).
 */

export class TranscriptionParser {
  /**
   * Parse a raw transcription string into segments.
   *
   * @param {string} rawInput
   * @returns {{ segments: string[], input: string, state: "typing"|"partial"|"matched"|"unknown"|"invalid" }}
   */
  parse(rawInput) {
    const input = rawInput || ""

    if (input.length === 0) {
      return { segments: [], input, state: "typing" }
    }

    // Reject inputs containing anything other than letters, apostrophes, accents, and hyphens
    if (/[^a-zA-Z\u00E0-\u024F\u2019\u0027\u0060]/.test(input.replace(/-/g, ""))) {
      return { segments: [], input, state: "invalid" }
    }

    // Split on hyphens. A trailing hyphen produces an empty last segment
    // which means the user just completed a segment.
    const segments = input.split("-")

    const hasTrailingHyphen = segments[segments.length - 1] === ""
    const meaningfulSegments = hasTrailingHyphen
      ? segments.slice(0, -1)
      : segments

    const state = this._classify(meaningfulSegments, hasTrailingHyphen)

    return { segments: meaningfulSegments, input, state }
  }

  /**
   * Return the current (unfinished) segment — everything after the last `-`.
   * If input ends with `-`, returns an empty string (segment just completed).
   *
   * @param {string} input
   * @returns {string}
   */
  getCurrentSegment(input) {
    if (!input) return ""
    const idx = input.lastIndexOf("-")
    return idx === -1 ? input : input.slice(idx + 1)
  }

  /**
   * Return all completed segments (before the last `-`).
   * If there is no `-`, returns an empty array.
   *
   * @param {string} input
   * @returns {string[]}
   */
  getCompletedSegments(input) {
    if (!input) return []
    const idx = input.lastIndexOf("-")
    if (idx === -1) return []
    return input.slice(0, idx).split("-")
  }

  /**
   * Whether the input ends with `-`, meaning a segment was just completed.
   *
   * @param {string} input
   * @returns {boolean}
   */
  isComplete(input) {
    return !!input && input.endsWith("-")
  }

  /**
   * Classify the current state based on the segments parsed.
   */
  _classify(meaningfulSegments, hasTrailingHyphen) {
    if (meaningfulSegments.some((s) => s === "")) {
      return "unknown"
    }

    if (hasTrailingHyphen) {
      return "matched"
    }

    if (meaningfulSegments.length <= 1) {
      return "typing"
    }

    return "partial"
  }
}
