// Stable override keys for editable content shown outside the slide reader,
// shared by every place that renders the value (module page hero, tab bar…).
export const moduleTitleKey = (id: number) => `module.${id}.title`
export const moduleObjectiveKey = (id: number, i: number) => `module.${id}.obj.${i}`
