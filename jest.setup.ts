import '@testing-library/jest-dom'

// jsdom does not implement window.prompt / window.alert. Edit mode is now gated
// behind a password prompt, so stub them: the default prompt returns the right
// password (edit-mode UI tests expect the toggle to succeed). Tests that check
// the password gate itself override window.prompt with their own spy.
window.prompt = jest.fn(() => 'loicssss')
window.alert = jest.fn()
