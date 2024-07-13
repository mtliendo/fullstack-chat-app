# AWS Amplify Gen 2 + AWS AppSync Chat App

This is a fullstack chat application built using React and the new AWS Amplify Gen 2 setup. The application utilizes various AWS services to handle the backend functionality.

## Features

- **Authentication**: The application uses Amazon Cognito, a user identity and authentication service, to handle user registration, login, and authentication.
- **Data Management**: The application uses AWS AppSync, a fully managed GraphQL service, and DynamoDB, a NoSQL database service, to store and retrieve chat messages and user data.
- **Storage**: The application uses Amazon S3, a secure and durable object storage service, to store file uploads (e.g., profile pictures, images shared in the chat).
- **Routing**: The application uses React Router Dom for client-side routing, allowing users to navigate between different pages.
- **Styling**: The application uses Tailwind CSS, a utility-first CSS framework, and DaisyUI, a Tailwind CSS component library, for styling the user interface.

## Getting Started

To get started with the application, follow these steps:

1. Clone the repository from the GitHub repository: `https://github.com/mtliendo/fullstack-chat-app`.
2. Install the dependencies by running `npm install`.
3. Start the development server with `npm run dev`. This will start the application on `localhost:5173`.
4. To deploy the Amplify backend, run `npx ampx sandbox`. This will create and deploy the necessary AWS resources for the application.

## AWS Services Used

1. **Amazon Cognito**: Amazon Cognito is a user identity and authentication service that handles user registration, login, and authentication for the application.
2. **AWS AppSync**: AWS AppSync is a fully managed GraphQL service that provides the data layer for the application. It's used to store and retrieve chat messages and user data.
3. **DynamoDB**: DynamoDB is a NoSQL database service that is used by AWS AppSync to store the data for the application.
4. **Amazon S3**: Amazon S3 is an object storage service that is used to store file uploads, such as profile pictures and images shared in the chat.

## Contributing

If you're interested in contributing to this application, please file an issue before submitting a pull request. To engage with the developer directly, visit their website at [https://focusotter.com](https://focusotter.com).
