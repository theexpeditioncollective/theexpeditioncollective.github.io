// videoscript.js

document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("hoverVideo")
  const resetButton = document.getElementById("resetButton")

  if (!video || !resetButton) return

  let hasPlayedOnce = false // Flag to track if the video has been played since the last reset

  // Play the video on hover
  video.addEventListener("mouseenter", () => {
    if (hasPlayedOnce) {
      // If the video has already played once since the last reset, do nothing
      return
    }
    video.currentTime = 0 // Start from the beginning
    video.play()
    hasPlayedOnce = true // Mark as played immediately after starting
  })

  // Reset video on button click
  resetButton.addEventListener("click", () => {
    video.pause() // Pause if it's currently playing
    video.currentTime = 0 // Reset to the beginning
    hasPlayedOnce = false // Allow it to play again on hover
  })

  // The 'ended' event listener is no longer strictly necessary for this logic,
  // as 'hasPlayedOnce' is set on 'mouseenter'. The video will naturally
  // stop on its last frame when it finishes playing.
})
