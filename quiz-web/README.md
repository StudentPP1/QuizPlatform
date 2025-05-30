<div align="center">
  <h3 align="center">Web</h3>
  <p align="center">
    Frontend application for <a href="#">quizplatform.com</a>
    <br />
  </p>
</div>

<details open="open">
  <summary>Table of contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
      <ul>
        <li><a href="#built-with">Built with</a></li>
      </ul>
    </li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About the project
This application displays and maintains the user interface for the Quizplatform website. 

### Built with

* [React](https://react.dev/)
* [SASS](https://github.com/sass/sass)
* [Typescript](https://www.typescriptlang.org/)

## Project Structure
```
public/                 # Contains static assets 
src/                    # source directory 
├── api/                # for API calls          
|   ├── services/       # For API communication 
|   ├── utils/          # Utility functions for API
├── components/         # Reusable UI components 
├── constants/          # Application-wide constants 
├── context/            # React Context API 
├── hooks/              # Custom React hooks 
├── models/             # Data models
├── pages/              # Components that represent entire pages 
├── router/             # Routing configuration
├── scss/               # SCSS files for styling
│
├── App.tsx             # The main root component
├── main.tsx            # The entry point of the app
└── vite-env.d.ts       # TypeScript declaration file for Vite-specific environment variables.

.env.local              # Local environment 
.gitignore              # Specifies intentionally untracked files 
eslint.config.js        # ESLint configuration file 
index.html              # The main HTML file 
package.json            # Contains project metadata, dependencies, and scripts.
README.md               # Documentation file 
tsconfig.app.json       # TypeScript configuration 
tsconfig.node.json      # TypeScript configuration
tsconfig.json           # Root TypeScript configuration file 
vite.config.ts          # Vite configuration file 
```

## Getting started

To get a local copy up and running follow these steps.

### Prerequisites

* yarn ([here](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable))
* quiz-api ([here](https://github.com/StudentPP1/QuizPlatform/tree/master/quiz-api))
* add `.env.local` in `QuizPlatform/quiz-web` dir with fields:

  ```env
  VITE_API_BASE_URL=http://localhost:3000 # local api url
  VITE_FRONT_URL=http://localhost:5137 # local front url
  VITE_ACCESS_TOKEN_EXPIRATION=60000*60 # same as in .env in quiz-api
  ```

### Installation

1. Install NPM packages
   ```sh
   cd QuizPlatform/quiz-web
   yarn install
   ```

## Usage

To start the application locally: 
```sh
yarn dev
```

## License

Distributed under the MIT License. See `LICENSE` for more information.