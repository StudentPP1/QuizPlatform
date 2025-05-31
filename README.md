
# Overview
A monorepository that provides Quizplatform API and Frontend services.

#

# Project Structure
```
├── quiz-api/        # backend
├── quiz-web/        # frontend
├── docker-compose.yml  # Start all project
└── README.md        
```

See README each part:
  + [quiz-api](./quiz-api/README.md)
  + [quiz-web](./quiz-web/README.md)

#

# Getting started
1. [follow steps](./quiz-web/README.md#getting-started)
2. run docker containers
```bash
docker-compose up --build
```
Once started, the services will be available at:
* **Frontend**: [http://localhost:3000](http://localhost:3000)
* **Backend**: [http://localhost:5000](http://localhost:5000) 

#

# Contributors
| Role           | GitHub                                     |
| --------------- | ------------------------------------------ |
| Frontend | [StudentPP1](https://github.com/StudentPP1) |
| Backend | [Fererra](https://github.com/Fererra) |

#

# License
Distributed under the MIT License. See `LICENSE` for more information.