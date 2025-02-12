# Інструкція з запуску сайту

## Кроки для запуску

1. **Склонуйте репозиторій**
   ```sh
   git clone <посилання-на-репозиторій>
   ```

2. **Перейдіть у папку проєкту**
   ```sh
   cd <назва-папки>
   ```

3. **Переконайтеся, що у вас встановлений Node.js останньої версії**
   - Завантажте та встановіть Node.js з [офіційного сайту](https://nodejs.org/), якщо його немає.
   - Перевірте версію:
     ```sh
     node -v
     ```

4. **Встановіть залежності**
   ```sh
   npm install
   ```

5. **Переконайтеся, що у вас є файл `.env`, якщо це необхідно**
   - Переконайтеся, що у файлі `.env` вказані всі потрібні змінні середовища.
   - Якщо `.env` відсутній, створіть його на основі `.env.example`.

6. **Запустіть локальний сервер**
   ```sh
   npm run dev
   ```

7. **Отримайте посилання на сайт**
   Після виконання команди в терміналі з'явиться посилання, за яким ви зможете відкрити сайт у браузері. 
   Зазвичай це `http://localhost:3000/` або інший порт, зазначений у налаштуваннях проєкту.

8. **Доступ до стартового пакету даних**
   - У файлі `.env.example` містяться змінні для підключення до бази даних.
   - Інформацію про стартовий пакет даних можна знайти у відповідній документації проєкту.

---

# Website Launch Guide

## Steps to Launch

1. **Clone the repository**
   ```sh
   git clone <repository-link>
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
   npm install
   ```

5. **Ensure you have a `.env` file if required**
   - Make sure the `.env` file contains all necessary environment variables.
   - If the `.env` file is missing, create it based on `.env.example`.

6. **Start the local server**
   ```sh
   npm run dev
   ```

7. **Get the website link**
   After executing the command, the terminal will display a link to open the website in your browser. 
   Typically, it will be `http://localhost:3000/` or another port specified in the project settings.

8. **Accessing the initial data package**
   - The `.env.example` file contains variables for database connection.
   - Information about the initial data package can be found in the relevant project documentation.

