type FormKey = string

export interface FormControl {
    key: FormKey;
    name: string;
    secureTextEntry?: boolean;
  } 

type UIOption = {
    name: string,
    key: string
}

type UISection = {
    heading?: string,
    options: UIOption[]
}

type PathConfig = {
    message?: string
    submessage?: string
    navigateTo?: string,
    ['form-keys']?: FormControl[]
    form: {
        [key: FormKey]: any
    },
    sections?: UISection[]
    placeholders?: {
        [key: FormKey]: string
    }
}

export type RouteConfig = {
    [path: string]: PathConfig
}