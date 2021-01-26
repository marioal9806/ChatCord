# ChatCord

A Chat Application implemented using React, Express, SocketIO and MongoDB. 

**Visit the live app here:** https://chat-cord-marioortega.herokuapp.com/ 

![ChatCord Demo Video](./chatcord-demo.gif)

## Features

- Interact in real time with lots of people!
- Join different and independent chat rooms
- Choose a cool random username
- You can select one of the randomly generated Avataaars from [DiceBear](https://avatars.dicebear.com/)
- Create an account and save your preferences
- Fully responsive (Desktop & mobile view)

## Frontend

Styling for the webpage was mainly written and structured using [SCSS](https://sass-lang.com/), leveraging key features like global variables, nesting and partials, to allow for a file structure made of several components.

The dynamic features of the web app were developed using the [React](https://reactjs.org/) framework, along with its Hooks API. The [axios](https://github.com/axios/axios) library was used for all the data fetching operations.

For specific components within React, the CSS styling was implemented with [styled-components](https://styled-components.com/) library, to allow for easy access and maintenance of these unique pieces of the app.

## Backend

The backend uses an Express server. All chat communications are implemented with [Socket.IO](https://socket.io/).

The application takes advantage of the event-based paradigm of SocketIO library. This allows to track the connection and disconnection of users, every incoming message and the selection of the room you're joining.

The driver selected to connect to the database was [mongoose](https://mongoosejs.com/) to create models from the different collections within the database and seamlessly create and retrieve information on them.

To implement the login and register functionality [express-validator](https://express-validator.github.io/docs/) was selected to sanitize and validate the user input. [Bcrypt](https://www.npmjs.com/package/bcrypt) was also implemented to save passwords securely. Finally, the app is session based, to communicate the user information across multiple pages of the app, thanks to [express-session](https://www.npmjs.com/package/express-session).

### Bundler

The bundler used to build the codebase and its dependencies was [Parcel](https://parceljs.org/). With little configuration, it allowed ES6 Javascript features, an SCSS preprocessor for efficient development. When bundling for production, Parcel minified and processed all the files for production.

### Deploy

The platform selected for deployment was [Heroku](https://www.heroku.com/home). The GitHub repository was connected to the Heroku app to deploy on every commit to the main branch. Using a free dyno, its Procfile and a couple of environment variables, the deployment was a breeze!
