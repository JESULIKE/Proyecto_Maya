export default class SuggestionEngine {
  #registry

  constructor(registry) {
    this.#registry = registry
  }

  findExactMatch(input) {
    const normalised = input.trim().toLowerCase()
    const match = this.#registry.find(
      (w) => w.transcription.toLowerCase() === normalised,
    )
    return match ?? null
  }

  getCompletions(prefix) {
    const normalised = prefix.trim().toLowerCase()
    return this.#registry.filter((w) =>
      w.transcription.toLowerCase().startsWith(normalised),
    )
  }

  suggest(input, completedSegments = []) {
    const trimmed = input.trim()
    if (!trimmed) return []

    const exact = this.findExactMatch(trimmed)
    if (exact) {
      return [
        {
          transcription: exact.transcription,
          segments: exact.segments,
          matchType: 'exact',
          displayText: exact.transcription,
        },
      ]
    }

    const prefixMatches = this.getCompletions(trimmed).map((w) => ({
      transcription: w.transcription,
      segments: w.segments,
      matchType: 'prefix',
      displayText: w.transcription,
    }))

    const lastDashIndex = trimmed.lastIndexOf('-')
    const currentFragment =
      lastDashIndex === -1 ? trimmed : trimmed.slice(lastDashIndex + 1)

    const continuationMatches = []
    if (currentFragment) {
      const lowerFragment = currentFragment.toLowerCase()
      for (const w of this.#registry) {
        const lastCompleted =
          completedSegments.length > 0
            ? completedSegments[completedSegments.length - 1].toLowerCase()
            : null

        const expectedSegments = lastCompleted
          ? w.segments.filter((s) => s.toLowerCase() !== lastCompleted)
          : w.segments

        for (const seg of expectedSegments) {
          if (
            seg.toLowerCase().startsWith(lowerFragment) &&
            seg.toLowerCase() !== lowerFragment
          ) {
            continuationMatches.push({
              transcription: w.transcription,
              segments: w.segments,
              matchType: 'continuation',
              displayText: w.transcription,
            })
            break
          }
        }
      }
    }

    const seen = new Set()
    const results = []

    for (const item of [...prefixMatches, ...continuationMatches]) {
      if (!seen.has(item.transcription)) {
        seen.add(item.transcription)
        results.push(item)
      }
    }

    if (results.length === 0) {
      const possible = this.#registry.filter((w) => {
        const lower = trimmed.toLowerCase()
        return w.segments.some((s) => s.toLowerCase().includes(lower))
      })

      for (const w of possible) {
        if (!seen.has(w.transcription)) {
          seen.add(w.transcription)
          results.push({
            transcription: w.transcription,
            segments: w.segments,
            matchType: 'possible',
            displayText: w.transcription,
          })
        }
      }
    }

    return results
  }

  /**
   * Get the ghost text prediction — the remaining characters to append
   * to the current input to complete the best suggestion.
   *
   * @param {string} input — current raw input
   * @param {string[]} completedSegments — segments already completed
   * @returns {{ ghostText: string, fullText: string, suggestion: object|null }}
   */
  getGhostPrediction(input, completedSegments = []) {
    const trimmed = input.trim()
    if (!trimmed) return { ghostText: '', fullText: '', suggestion: null }

    const suggestions = this.suggest(trimmed, completedSegments)
    if (suggestions.length === 0) return { ghostText: '', fullText: '', suggestion: null }

    const best = suggestions[0]
    const fullText = best.transcription
    const lowerInput = trimmed.toLowerCase()
    const lowerFull = fullText.toLowerCase()

    // If the input already matches or exceeds the suggestion, no ghost
    if (lowerInput === lowerFull || lowerFull.startsWith(lowerInput) === false) {
      return { ghostText: '', fullText, suggestion: best }
    }

    // The ghost is the remaining part of the transcription
    const ghostText = fullText.slice(trimmed.length)
    return { ghostText, fullText, suggestion: best }
  }
}
