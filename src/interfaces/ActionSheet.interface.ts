
export type Actions = string[]

export type ActionSheet = {
    [key: string]: Actions
}

export type ActionSheetConfig = {
    [key: string]: ActionSheet
}