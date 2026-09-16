import { ref, computed } from 'vue'
import { TranscriptionParser } from '~/lib/maya/transcription/Parser.js'
import SuggestionEngine from '~/lib/maya/transcription/SuggestionEngine.js'
import words from '~/data/words.js'

export function useTranscription() {
  const input = ref('')
  const parser = new TranscriptionParser()
  const engine = new SuggestionEngine(words)

  const parsed = computed(() => parser.parse(input.value))

  const currentSegment = computed(() => parser.getCurrentSegment(input.value))

  const completedSegments = computed(() => parser.getCompletedSegments(input.value))

  const suggestions = computed(() => engine.suggest(input.value, completedSegments.value))

  const exactMatch = computed(() => engine.findExactMatch(input.value) || null)

  const matchedWord = computed(() => exactMatch.value || null)

  const glyphPath = computed(() => matchedWord.value?.glyphPath || null)

  const displayState = computed(() => {
    if (!input.value) return 'empty'
    if (exactMatch.value) return 'matched'
    if (suggestions.value.length > 0) return 'partial'
    return 'typing'
  })

  const interpretedTranscription = computed(() => {
    if (matchedWord.value) {
      return matchedWord.value.transcription || matchedWord.value
    }
    return input.value
  })

  // Ghost prediction for autocomplete
  const ghostPrediction = computed(() => engine.getGhostPrediction(input.value, completedSegments.value))

  const ghostText = computed(() => ghostPrediction.value.ghostText)

  const ghostFullText = computed(() => ghostPrediction.value.fullText)

  const ghostSuggestion = computed(() => ghostPrediction.value.suggestion)

  function setInput(value) {
    input.value = value
  }

  function clear() {
    input.value = ''
  }

  function acceptSuggestion(suggestion) {
    if (suggestion && suggestion.transcription) {
      input.value = suggestion.transcription
    }
  }

  /**
   * Accept the ghost prediction — fills input with the full predicted text.
   */
  function acceptGhost() {
    if (ghostFullText.value) {
      input.value = ghostFullText.value
    }
  }

  /**
   * Accept only the next segment from the ghost prediction.
   * If typing "k" and prediction is "k'al-aw-tuun", accepts "k'al-".
   */
  function acceptNextSegment() {
    const full = ghostFullText.value
    if (!full) return

    const current = input.value
    const lowerCurrent = current.toLowerCase()
    const lowerFull = full.toLowerCase()

    // Find the next segment boundary (dash) after current position
    const remaining = full.slice(current.length)
    const dashIndex = remaining.indexOf('-')

    if (dashIndex !== -1) {
      // Accept up to and including the next dash
      input.value = full.slice(0, current.length + dashIndex + 1)
    } else {
      // No more dashes — accept the full text
      input.value = full
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      // Accept ghost if available, otherwise first suggestion
      if (ghostFullText.value && ghostFullText.value !== input.value) {
        acceptGhost()
      } else if (suggestions.value.length > 0) {
        acceptSuggestion(suggestions.value[0])
      }
    } else if (event.key === 'Tab') {
      // Tab accepts the ghost prediction
      if (ghostText.value) {
        event.preventDefault()
        acceptGhost()
      }
    } else if (event.key === 'ArrowRight') {
      // Right arrow at end of input accepts next segment
      const el = event.target
      if (el && el.selectionStart === el.selectionEnd && el.selectionStart === input.value.length) {
        if (ghostText.value) {
          event.preventDefault()
          acceptNextSegment()
        }
      }
    } else if (event.key === 'Escape') {
      event.preventDefault()
      clear()
    }
  }

  return {
    input,
    parser,
    engine,
    parsed,
    currentSegment,
    completedSegments,
    suggestions,
    exactMatch,
    matchedWord,
    glyphPath,
    displayState,
    interpretedTranscription,
    ghostText,
    ghostFullText,
    ghostSuggestion,
    setInput,
    clear,
    acceptSuggestion,
    acceptGhost,
    acceptNextSegment,
    handleKeydown,
  }
}
