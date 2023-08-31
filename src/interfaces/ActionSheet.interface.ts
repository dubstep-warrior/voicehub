import ActionSheet from "react-native-actionsheet";

export type Actions = string[]

export type ActionSheetPageConfig = {
    [key: string]: Actions
}

export type ActionSheetConfig = {
    [key: string]: ActionSheetPageConfig
}

export type ActionSheetProps = {
    ref: React.RefObject<ActionSheet>,
    options: Actions,
    cancelButtonIndex: number,
    onPress: (index: number) => Promise<void>  
  }