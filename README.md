<h1 align="center">
   SlotSwapper
</h1>

## Overview

SlotSwapper is a full-stack application designed to solve the challenge of **atomic resource exchange**. It allows authenticated users to view time slots marked as available by others and propose a swap, ensuring both schedules are updated simultaneously upon acceptance.



## Technologies Used

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT Tokens


## Deployment 
* **Frontend** - Vercel
* **Backend** - Render

  
##  Live Demo

Experience the SlotSwapper live here:

[Click Here](https://slot-swapper-psi.vercel.app/)



## 🛠️ Setup and Installation Instructions

Follow these steps to set up and run the SlotSwapper application locally.

### Prerequisites

* **Node.js (v14+)** and **npm**
* **MongoDB Atlas Account** (or local MongoDB instance)

1. **Clone the repository**
```bash
git clone [YOUR_REPOSITORY_URL_HERE]
cd SlotSwapper
```

2. **Set up Backend**
```bash
cd backend
npm install

#create .env file in backend and add environment variables as below.
```

### Environment Variables

**Backend (.env)**
```env

# Replace <USER> and <PASSWORD> with your MongoDB Atlas credentials
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER_URL>/slotswapper?retryWrites=true&w=majority
JWT_SECRET=YOUR_VERY_STRONG_SECRET_KEY
```


3. **Set up Frontend**
```bash
cd ../frontend
npm install
```


4. **Start Development Servers**

Backend (Terminal 1):
```bash
cd backend
nodemon server.js
```

Frontend (Terminal 2):
```bash
cd frontend
npm start
```

**📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



