# Website Launch Guide

## Steps to Launch

1. **Clone the repository**
   ```sh
   git clone https://github.com/StudentPP1/QuizPlatform.git
   ```

2. **Navigate to the project folder**
   ```sh
   cd <folder-name>
   ```

3. **Ensure that you have the latest version of Node.js installed**
   - Download and install Node.js from the [official website](https://nodejs.org/) if it's not installed.
   - Check the version:
     ```sh
     node -v
     ```

4. **Install dependencies**
   ```sh
   yarn install
   ```

5. **Ensure you have a `.env` file if required**
   - Make sure the `.env` file contains all necessary environment variables.

6. **Start the API part**
   ```sh
   cd quiz-api
   docker-compose up -d
   yarn start
   ```
7. **Start the front part**
   ```sh
   cd quiz-web
   yarn dev
   ```
   
8. **Get the website link**
   After executing the command, the terminal will display a link to open the website in your browser. 
   Typically, it will be `http://localhost:5137/` or another port specified in the project settings.
   
