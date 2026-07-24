'use client'

import { createContext, useContext } from 'react'

// Exposes the reader's global "edit mode" flag to visual components, so a
// visual can offer its own in-place content editing (e.g. the inbox emails).
// SectionReader wraps every visual in <EditModeProvider value={editMode}>.
const EditModeContext = createContext<boolean>(false)
export const EditModeProvider = EditModeContext.Provider

export function useEditMode(): boolean {
  return useContext(EditModeContext)
}
