# ChatCord

A Chat Application implemented using React, Express, SocketIO and MongoDB.

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

### Bundler

The bundler used to build the codebase and its dependencies was [Parcel](https://parceljs.org/). With little configuration, it allowed ES6 Javascript features, an SCSS preprocessor and minified files for production.

### Deploy

The platform selected for deployment was [Heroku](https://www.heroku.com/home). Using a free dyno, its Procfile and a couple of environment variables and automatic actions by connecting this repository, the deployment was a breeze!