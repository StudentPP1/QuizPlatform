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

## Getting started

To get a local copy up and running follow these steps.

### Prerequisites

* yarn ([here](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable))
* quiz-api ([here](https://github.com/StudentPP1/QuizPlatform/tree/master/quiz-api))
* add `.env.local` in quiz-web dir with filled fields
```env
VITE_API_BASE_URL=
VITE_FRONT_URL=
VITE_ACCESS_TOKEN_EXPIRATION=
```

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/StudentPP1/QuizPlatform.git
   ```
2. Install NPM packages
   ```sh
   cd quiz-web
   yarn install
   ```

## Usage

To start the application locally: 
```sh
yarn dev
```

## License

Distributed under the MIT License. See `LICENSE` for more information.