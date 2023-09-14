<div align="center">
<h1 align="center">
<img src="https://github.com/dubstep-warrior/voicehub/blob/main/assets/logo-white.png" width="100" /> 
<br>VoiceHub
</h1>
<h3>◦ Empowering voices. Building personalities and ever-lasting connections. </h3>
<h3>◦ Developed with the software and tools listed below.</h3>

<p align="center">
<img src="https://img.shields.io/badge/Firebase-FFCA28.svg?style&logo=Firebase&logoColor=black" alt="Firebase" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style&logo=JavaScript&logoColor=black" alt="JavaScript" />
<img src="https://img.shields.io/badge/React-61DAFB.svg?style&logo=React&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/React_Native-%2320232a.svg?style&logo=React&logoColor=%2361DAFB" alt="React Native">
<img src="https://img.shields.io/badge/Redux-%23593d88.svg?style&logo=redux&logoColor=white" alt="Redux">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style&logo=TypeScript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Expo-000020.svg?style&logo=Expo&logoColor=white" alt="Expo" />
<img src="https://img.shields.io/badge/Markdown-000000.svg?style&logo=Markdown&logoColor=white" alt="Markdown" />
<img src="https://img.shields.io/badge/JSON-000000.svg?style&logo=JSON&logoColor=white" alt="JSON" />
</p>
<img src="https://img.shields.io/github/languages/top/dubstep-warrior/voicehub?style&color=5D6D7E" alt="GitHub top language" />
<img src="https://img.shields.io/github/languages/code-size/dubstep-warrior/voicehub?style&color=5D6D7E" alt="GitHub code size in bytes" />
<img src="https://img.shields.io/github/commit-activity/m/dubstep-warrior/voicehub?style&color=5D6D7E" alt="GitHub commit activity" />
</div>

---

## 📒 Table of Contents
- [📒 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [⚙️ Features](#-features)
- [📂 Project Structure](#project-structure)
- [🧩 Modules](#modules)
- [🚀 Getting Started](#-getting-started)
- [🗺 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👏 Acknowledgments](#-acknowledgments)

---


## 📍 Overview

VoiceHub is a React Native app that aims to provide a comprehensive chat experience. It incorporates key features such as user authentication, real-time messaging, profile management, and friend connections. The project utilizes Firebase for its backend services, ensuring secure and reliable messaging. VoiceHub offers a customizable and user-friendly interface, supporting seamless communication and collaboration for individuals and groups.

---

## ⚙️ Features

- Firebase Initialization: 
    - The firebase.ts file initializes a Firebase app using the provided configuration, including authentication, Firestore, and storage services. 
    - Exported instances of Firebase services are made available for use in other modules.
- Redux Store Setup: 
    - In App.tsx, the Redux store is set up and provided to app components using the Provider component from react-redux.
    - It renders the VoiceHub component, serving as the app's entry point for functionality.
- Authentication: 
    - In VoiceHub.tsx, Firebase and React Navigation are used for authentication. 
    - Users can log in or register, and the app redirects them accordingly.  
- Tabbed Pages Template: 
    - StandardTabPage.tsx defines a template for creating tabbed pages in a React Native app.
    - It provides a safe area for content, customizable heading sections, and child component management.
- User Profile Management: 
    - Profile.tsx and Default.tsx components in the Profile section allow users to view and update their profile information. 
    - Features include updating name and email, logging out, and managing profile images.
- Friends Management: 
    - Friends.tsx and Default.tsx components in the Friends section manage navigation between screens for viewing friends, friend requests, and adding friends.
- User Chat and Messaging: 
    - In the Home section, Chat.tsx, Default.tsx, and Home.tsx components implement chat features. Users can send messages, view chat lists, and select chats.
- Tab Configuration: 
    - In the Config section, Main.config.ts defines main tabs for the mobile application. Tabs include Home, Friends, and Profile.
- Redux Hooks: hooks.ts provides custom hooks, useAppDispatch and useAppSelector, for using Redux's dispatch and selector functions in a React app. They have typings for AppDispatch and RootState.
- State Management:
    - State management in this app revolves around Redux slices, hooks for easy access, and Firebase for real-time data synchronization and authentication. These components work together to ensure a consistent and responsive user experience.
    - Asynchronous calls to firebase to resolve feature functionality is implemented in Redux actions.
- Utility Functions: 
    - Subscribers.ts retrieves chat data and updates the app state with messages and notifications from the Firestore database.
    - FileUploader.ts allows users to upload images to Firebase storage and retrieve download URLs. 
    - StartChat.ts starts chats with selected users, updating Redux state and navigating to the Chat screen.
 

---


## 📂 Project Structure

```bash
repo 
├── assets 
│   ├── ...30 files
├── src
│   ├── config
│   │   ├── Main.config.ts 
│   ├── definitions
│   │   ├── actionsheet.definition.ts 
│   ├── interfaces
│   │   ├── ActionSheet.interface.ts
│   │   ├── Chat.interface.ts
│   │   ├── NavigationProps.interface.ts
│   │   ├── Props.interface.ts
│   │   ├── RootStackParamList.interface.ts
│   │   ├── RouteConfig.interface.ts
│   │   ├── RouteConfiguration.interface.ts
│   │   ├── VHUser.ts
│   ├── pages
│   │   ├── Access.tsx
│   │   ├── Invite.tsx
│   │   ├── Main.tsx
│   │   ├── ResolveChat.tsx
│   │   ├── SearchUsers.tsx
│   │   ├── UpdateField.tsx
│   ├── shared
│   │   ├── Button.tsx
│   │   ├── Error.tsx
│   │   ├── FormData.tsx
│   │   ├── Input.tsx
│   │   ├── MessageText.tsx
│   │   ├── ProfileOverview.tsx
│   │   ├── SimpleForm.tsx
│   │   ├── UserList.tsx
│   ├── store
│   │   ├── actions
│   │   │   ├── auth.actions.tsx
│   │   │   ├── user.actions.tsx
│   │   ├── slices
│   │   │   ├── app.slice.tsx
│   │   │   ├── user.slice.tsx
│   │   ├── hooks.ts
│   │   ├── store.ts
│   ├── tabs
│   │   ├── main
│   │   │   ├── Connections
│   │   │   │   ├── DefaultTabs
│   │   │   │   │   ├── ConnectionsTab.tsx
│   │   │   │   ├── Connections.tsx
│   │   │   │   ├── Default.tsx 
│   │   │   ├── Home
│   │   │   │   ├── Chat.tsx
│   │   │   │   ├── Default.tsx
│   │   │   │   ├── Home.tsx
│   │   │   ├── Profile
│   │   │   │   ├── Default.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   ├── StandardTabPage.tsx
│   ├── utils
│   │   │   ├── FileUploader.ts
│   │   │   ├── StartChat.ts
│   │   │   ├── Subscribers.ts
│   ├── VoiceHub.tsx 
├── .gitignore
├── app.json
├── App.tsx
├── babel.config.js
├── env.d.ts
├── firebase.ts
├── Images.config.ts
├── package.json 
├── package-lock.json
├── README.md
├── Styles.config.ts
├── tsconfig.json 

39 directories, 51 files
```

---

## 🧩 Modules

<details closed><summary>Root</summary>

| File                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                        | ---                                                                                                                                                                                                                                                                                                                                                                                     |
| [babel.config.js](https://github.com/dubstep-warrior/voicehub/blob/main/babel.config.js)   | This code exports a function that configures Babel presets and plugins for a project using Expo. It enables the use of environment variables via the module "react-native-dotenv" and incorporates the "react-native-reanimated" plugin for improved performance.                                                                                                                       |
| [firebase.ts](https://github.com/dubstep-warrior/voicehub/blob/main/firebase.ts)           | This code imports necessary functions from Firebase SDKs and provides the Firebase configuration for the web app. It initializes the Firebase app, gets the authentication, firestore, and storage instances, and exports them for use in other parts of the code. Messaging and persistence functions are commented out, but can be enabled if needed.                                 |
| [Styles.config.ts](https://github.com/dubstep-warrior/voicehub/blob/main/Styles.config.ts) | This code defines a stylesheet with various predefined styles for buttons, icons, text, and header containers in a React Native app. It imports a theme configuration for custom styling values. The styles are created using the `StyleSheet.create()` method and include properties like width, height, borderRadius, backgroundColor, padding, margin, positioning, and font styles. |
| [Images.config.ts](https://github.com/dubstep-warrior/voicehub/blob/main/Images.config.ts) | The code defines and exports a configuration object that contains various image assets used in the application. The assets include logos, icons, and various other images. The code allows easy import and access to these image assets throughout the application.                                                                                                                     |
| [env.d.ts](https://github.com/dubstep-warrior/voicehub/blob/main/env.d.ts)                 | This code exports the URL of the backend server environment variable as a constant, allowing it to be accessed throughout the application.                                                                                                                                                                                                                                              |
| [App.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/App.tsx)                   | This code establishes the Redux store for state management and wraps the <VoiceHub> component with the <Provider> from react-redux. The <VoiceHub> component is the root component of the application rendered inside the provider, enabling redux state access throughout the app.                                                                                                     |

</details>

<details closed><summary>Src</summary>

| File                                                                                   | Summary                                                                                                                                                                                                                                                                                      |
| ---                                                                                    | ---                                                                                                                                                                                                                                                                                          |
| [VoiceHub.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/VoiceHub.tsx) | This code sets up a navigation container using React Navigation. It handles authentication using Firebase, displaying the login and register screens if not authenticated, and the main screen if authenticated. The `AuthOnRender` action is dispatched to update the authentication state. |

</details>

<details closed><summary>Main</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [StandardTabPage.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/StandardTabPage.tsx) | This code defines a functional component called StandardTabPage which is a part of a React Native app. It imports various dependencies such as React Native components, themes, styles, and store selectors. The component sets up a safe area container and includes a header and body components within it. The header consists of a left, center, and right component which can be customized. The body can contain any child components passed to it. |

</details>

<details closed><summary>Connections</summary>

| File                                                                                                               | Summary                                                                                                                                                                                                                                  |
| ---                                                                                                                | ---                                                                                                                                                                                                                                      |
| [Default.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Connections/Default.tsx)         | This code defines a default page for displaying friends and friend-related functionalities in a React Native app. It includes a header with a search button, a tab navigator for different friend categories, and an animated component. |
| [Connections.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Connections/Connections.tsx) | This code defines a navigation stack using React Navigation. It includes two screens: "Default" and "AddFriend". The header is hidden, and the initial route is determined by the "route" prop passed to the component.                  |

</details>

<details closed><summary>Defaulttabs</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                                                                                                                                              |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                                                                                                                                  |
| [ConnectionsTab.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Connections/DefaultTabs/ConnectionsTab.tsx) | The code is a React Native component that renders a list of user connections (friends, friend requests, and outgoing requests). It allows users to perform actions on each connection such as sending a message, accepting/rejecting requests, removing friends/requests. The component also handles empty states and displays appropriate messages. |

</details>

<details closed><summary>Profile</summary>

| File                                                                                                   | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                                    | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [Profile.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Profile/Profile.tsx) | This code is a component called Profile that uses React Navigation to create a Stack Navigator with two screens: Default and UpdateField. It retrieves the user state from the Redux store and conditionally renders the navigator if the user state exists. The navigator is provided with initial params for each screen to set the current route. The header is hidden for all screens.                                                                       |
| [Default.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Profile/Default.tsx) | This code is a React Native component that displays a user's profile information and allows them to update specific fields. It retrieves user data from the state, displays the profile overview, and renders sections with options for field updates. When an option is selected, it navigates to the "UpdateField" screen with the selected field data. The component also includes a logout button and uses various styles to layout and format the elements. |

</details>

<details closed><summary>Home</summary>

| File                                                                                                | Summary                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                 | ---                                                                                                                                                                                                                                                                                                                                                   |
| [Chat.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Home/Chat.tsx)       | This code implements a chat feature using a drawer navigator to display a list of users. Users can tap on a user's profile and initiate a chat by sending a message. The code handles the logic for sending messages and opening existing chats or starting new ones. Overall, it provides the core functionalities required for a basic chat system. |
| [Default.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Home/Default.tsx) | This code implements a messaging feature using React Native and React Navigation. It includes functionalities such as typing a chat message, uploading of images for the chat message, and message browsing capabilities for the currently selected chat. The code also handles actions such as closing the drawer and navigation between screens.                              |
| [Home.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/tabs/main/Home/Home.tsx)       | The code defines a React Native screen component called Home, used for a chat application. It includes various dependencies, imports, and components such as a custom drawer, overlays, action sheets, modals, and more. The code handles user interactions, updates, and navigation within the app.                                                  |

</details>

<details closed><summary>Config</summary>

| File                                                                                              | Summary                                                                                                                                                                                                                                                                                              |
| ---                                                                                               | ---                                                                                                                                                                                                                                                                                                  |
| [Main.config.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/config/Main.config.ts) | This code defines the core functionalities of a navigation tab configuration in a React Native app. It exports an array of tab configurations, each including the tab name, associated component, and selected/unselected icons. These configurations are used to generate the main navigation tabs. |

</details>

<details closed><summary>Definitions</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                                     |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                                                         |
| [actionsheet.definition.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/definitions/actionsheet.definition.ts) | The code declares a module for a React Native Action Sheet component. It offers options, handles user press, and supports title, message, tintColor, cancelButtonIndex, destructiveButtonIndex, and custom styles. It provides a "show" method to display the action sheet. |

</details>

<details closed><summary>Store</summary>

| File                                                                                 | Summary                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                  | ---                                                                                                                                                                                                                                                                                                                                                                                                              |
| [hooks.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/store/hooks.ts) | This code creates custom hooks, useAppDispatch and useAppSelector, that leverage the react-redux library to provide typed access to the dispatch function and selected state from the Redux store, respectively. These hooks can be used throughout the app for Redux-related operations.                                                                                                                        |
| [store.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/store/store.ts) | The code initializes and configures a Redux store using the "configureStore" function from the "@reduxjs/toolkit" library. It combines two reducers, "userReducer" and "appReducer", to handle the state for "user" and "app" respectively. It also sets custom middleware to disable serializable check. The code also defines the types for the store state ("RootState") and action dispatch ("AppDispatch"). |

</details>

<details closed><summary>Slices</summary>

| File                                                                                                  | Summary                                                                                                                                                                                                                                                                     |
| ---                                                                                                   | ---                                                                                                                                                                                                                                                                         |
| [user.slice.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/store/slices/user.slice.ts) | This code defines a Redux slice for managing user information. It initializes the state with user details and chat data, and provides reducers to update and assign user information. It also exports selectors to access the user state in other parts of the application. |
| [app.slice.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/store/slices/app.slice.ts)   | This code defines the slice state for an application and creates functions to update and manipulate the state. It also includes functions to handle Firebase listeners and notifications. The code utilizes Redux toolkit for state management.                             |

</details>

<details closed><summary>Actions</summary>

| File                                                                                                       | Summary                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---                                                                                                        | ---                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [auth.actions.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/store/actions/auth.actions.ts) | The code includes functions for user authentication and authorization, updating user information, managing user profiles, fetching and subscribing to real-time data from Firebase, and handling various user actions such as signing in, signing out, and resolving user access. It also includes functions for updating user profiles, managing user connections, and handling real-time chat functionality.          |
| [user.actions.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/store/actions/user.actions.ts) | This code includes various functions related to user management and chat functionality. It utilizes Firebase services for authentication, database operations, and file uploads. The code enables user updates, user search, friend requests, chat creation, message sending, join/leave/delete chats, and friend removal. It also handles error handling and dispatching relevant actions to update application state. |

</details>

<details closed><summary>Utils</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                     |
| ---                                                                                                | ---                                                                                                                                                                                                                                                                         |
| [Subscribers.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/utils/Subscribers.ts)   | This code fetches chat messages from Firebase Firestore, transforms the data, and updates the app state with the retrieved messages. It uses Firebase listeners to keep the messages updated in real-time.                                                                  |
| [FileUploader.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/utils/FileUploader.ts) | This code allows for the uploading of an image to Firebase storage. It first converts the image into a blob, then uses the blob to store the image in the specified path on Firebase storage. Finally, it retrieves and returns the download URL of the uploaded image.     |
| [StartChat.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/utils/StartChat.ts)       | The code exports a function named StartChat that updates the user's chat and app slices in the store. It creates a direct message chat with a selected user using Firebase authentication. The function then navigates to the "Chat" screen in the "Main" navigation stack. |

</details>

<details closed><summary>Interfaces</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                                            |
| ---                                                                                                                                     | ---                                                                                                                                                                                                                                                                                                                                |
| [ActionSheet.interface.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/ActionSheet.interface.ts)               | This code provides a reusable React Native component for creating action sheets. It defines types for defining action configurations and options, and for handling user interactions. It helps manage multiple pages of actions and facilitates making requests upon the user's selection.                                         |
| [RouteConfiguration.interface.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/RouteConfiguration.interface.ts) | This code defines two types: Form, which represents a generic form object with any key-value pairs, and RouteConfiguration, which represents generic route configurations with any key-value pairs.                                                                                                                                |
| [RootStackParamList.interface.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/RootStackParamList.interface.ts) | The code defines the root stack parameter list for a navigation stack in a mobile app. It includes various screen names and their corresponding data types to handle navigation between screens and passing data.                                                                                                                  |
| [Chat.interface.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/Chat.interface.ts)                             | The code defines various types and collections related to chats and messages. It includes types for messages, chats, temporary chats, and collections of chats and messages. It also includes types for user state chats, which contain collections for both regular chats and direct messages.                                    |
| [NavigationProps.interface.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/NavigationProps.interface.ts)       | This code imports the necessary types from a navigation library and the definition of the navigation stack parameters. It defines the type of navigation props, using the imported screen props and the root stack parameter list.                                                                                                 |
| [VHUser.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/VHUser.ts)                                             | This code defines types and interfaces related to user profiles, connections, and user lists. It includes types for user information, user identifiers, connection details, and references to user lists. This code provides a foundation for managing user profiles, connections, and user lists in a TypeScript project.         |
| [Props.interface.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/Props.interface.ts)                           | This code exports a Props type with various optional properties. It includes a string name, a function handleFormValueChange, a formKey, and textInputProps.                                                                                                                                                                       |
| [RouteConfig.interface.ts](https://github.com/dubstep-warrior/voicehub/blob/main/src/interfaces/RouteConfig.interface.ts)               | This code defines interfaces and types for handling form controls and routing configurations in a TypeScript project. It establishes a structure for storing and accessing form data, as well as defining UI options and sections. The aim is to enable efficient management of form inputs and navigation within the application. |

</details>

<details closed><summary>Shared</summary>

| File                                                                                                        | Summary                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---                                                                                                         | ---                                                                                                                                                                                                                                                                                                                                                                                                                                |
| [FormData.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/FormData.tsx)               | The code is a custom React hook that manages form data. It handles setting initial form values, updating form values, resetting the form, and replacing the form with new values. It returns an array of form values, a function to handle form value changes, a function to update form values, a function to reset the form, and a function to replace the form with new values.                                                 |
| [MessageText.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/MessageText.tsx)         | This code defines a functional component called MessageText, which renders a Text element with the provided text as its content. The text color is set to black, and there is padding and margin applied for styling. It also imports necessary dependencies and selectors from the store for data retrieval.                                                                                                                      |
| [SimpleForm.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/SimpleForm.tsx)           | This code segment is a React Native component that represents a simple form. It includes input fields, buttons, and error messages. The form values are handled using useState hook, and form submission triggers different actions depending on the route name. It leverages various React Native components and styles for rendering the UI.                                                                                     |
| [Error.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/Error.tsx)                     | This code exports a component named "Error" that displays an error message with a corresponding icon. It takes in a "message" prop as input and renders a styled view containing an image icon and text. The view has a border and a red color scheme to indicate an error.                                                                                                                                                        |
| [Input.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/Input.tsx)                     | The code exports a component called "Input" that renders a text input field. It accepts various props including name, handleFormValueChange, formKey, and style. It uses the React Native TextInput component to render the text input field. The value of the input is made available through the handleFormValueChange function that is passed in as a prop. The style prop is used to determine the styling of the input field. |
| [UserList.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/UserList.tsx)               | The code defines a component called UserList that displays a list of users. The component takes in a list of user data and renders each user item. It allows for customization such as displaying smaller or selected users, and provides callbacks for handling user clicks and a "more" button. The user's profile image, displayed name, and status are shown along with an optional more button.                               |
| [ProfileOverview.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/ProfileOverview.tsx) | This code defines a React Native component called "ProfileOverview" which displays a user's profile information. It includes features such as uploading and editing the profile picture, editing the username and display name, and editing the user's status. It utilizes various external dependencies and custom components for functionality and styling.                                                                      |
| [Button.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/shared/Button.tsx)                   | This code is a React Native component for a customizable button. It renders different styles based on the given theme and displays a loading indicator when the app is submitting data. The button's text and onPress callback are passed as props. The styles are defined using a StyleSheet API.                                                                                                                                 |

</details>

<details closed><summary>Pages</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---                                                                                                | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [UpdateField.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/pages/UpdateField.tsx) | This code is a React Native component that provides a form for updating a field. It renders a container with a simple form inside, which can be dismissed by pressing anywhere on the screen. The styling is defined using a StyleSheet object, with a background color, padding, and width specified.                                                                                                                                                                                                                              |
| [ResolveChat.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/pages/ResolveChat.tsx) | This code is a React Native component called "ResolveChat." It handles the creation and joining of chat rooms. Users can either create a new chat room or join an existing one. The component includes form inputs for the chat name and an image. It also handles image picking from the camera or gallery. User input validation and error handling are included. The component dispatches actions to the Redux store to add the chat or join an existing one. It also provides a function callback for handling form submission. |
| [Main.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/pages/Main.tsx)               | This code defines a component for the main screen of a mobile app using React Native and React Navigation. It creates a bottom tab navigation bar with customizable options and icons. The component renders multiple screens based on the provided options. The design and behavior of the tab bar can be customized using the style and configuration options.                                                                                                                                                                    |
| [Access.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/pages/Access.tsx)           | The code is a React Native component for handling user access. It includes functionalities such as rendering a form, handling form submission, validating form inputs, and showing error messages. It also utilizes navigation to navigate between screens and implements a keyboard avoiding view for better user experience.                                                                                                                                                                                                      |
| [SearchUsers.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/pages/SearchUsers.tsx) | This code is a React Native component that allows users to search for other users. It includes functionalities such as displaying a form, querying the user database, showing search results in a scrollable list, and triggering action sheets for adding or removing friends. The code also handles keyboard dismissal and styling.                                                                                                                                                                                               |
| [Invite.tsx](https://github.com/dubstep-warrior/voicehub/blob/main/src/pages/Invite.tsx)           | The code is a React component called "Invite" that displays an invitation to a chat. It shows the chat's name, allows the user to copy the chat ID to the clipboard, and provides a button to close the invitation. It uses external modules such as React Native, Expo Clipboard, and react-native-flash-message for additional functionality.                                                                                                                                                                                     |

</details>

---

## 🚀 Getting Started

### ✔️ Prerequisites

Before you begin, ensure that you have the following prerequisites installed:
> - `ℹ️ Requirement 1`
> - `ℹ️ Requirement 2`
> - `ℹ️ ...`

### 📦 Installation

1. Clone the voicehub repository:
```sh
git clone https://github.com/dubstep-warrior/voicehub
```

2. Change to the project directory:
```sh
cd voicehub
```

3. Install the dependencies:
```sh
npm install
```

### 🎮 Using voicehub

```sh
npm start
``` 

---


## 🗺 Roadmap

> - [ ] `ℹ️  Task 1: Implement voice chatting features`
> - [ ] `ℹ️  Task 2: Refactor Redux actions` 


---

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:
1. Fork the project repository. This creates a copy of the project on your account that you can modify without affecting the original project.
2. Clone the forked repository to your local machine using a Git client like Git or GitHub Desktop.
3. Create a new branch with a descriptive name (e.g., `new-feature-branch` or `bugfix-issue-123`).
```sh
git checkout -b new-feature-branch
```
4. Make changes to the project's codebase.
5. Commit your changes to your local branch with a clear commit message that explains the changes you've made.
```sh
git commit -m 'Implemented new feature.'
```
6. Push your changes to your forked repository on GitHub using the following command
```sh
git push origin new-feature-branch
```
7. Create a new pull request to the original project repository. In the pull request, describe the changes you've made and why they're necessary.
The project maintainers will review your changes and provide feedback or merge them into the main branch.

--- 