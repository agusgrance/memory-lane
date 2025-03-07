# Memory Lane

## 📂 Project Structure

```
├── api/
│   ├── controllers.js
│   ├── db.js
│   ├── middlewares.js
│   └── main.js
├── app/
│   ├── api/
│   │   └── uploadthing/
│   │       ├── core.ts
│   │       └── route.ts
│   ├── page.tsx
│   └── metadata.ts
├── components/
│   ├── MemoryLane/
│   ├── MemoryCard/
│   ├── CreateMemoryModal/
│   ├── EditMemoryModal/
│   └── EditProfileModal/
├── services/
│   └── api.ts
├── utils/
│   ├── uploadthing.ts
│   └── utils.ts
├── public/
├── lib/
├── .env
├── .env.example
└── README.md
```

## 🛠 Technical Overview

This application is built using **Next.js 14** with **TypeScript**, providing a modern and type-safe development experience. The implementation focuses on creating a responsive, user-friendly interface for sharing memories.

### ✨ Key Features

- **Memory Management**: Users can create, edit, and delete memories with titles, descriptions, timestamps, and images.
- **Infinite Scroll**: Implemented pagination with infinite scroll for optimal performance.
- **Image Upload**: Integrated with **UploadThing** for secure image handling.
- **Responsive Design**: Mobile-first approach using **Tailwind CSS**.
- **Real-time Updates**: Uses **React Query** for efficient data fetching and cache management.
- **Sorting**: Memories can be sorted from older to newer or vice versa.

### 🏗 Technical Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS.
- **Backend**: Express.js with SQLite database.
- **State Management**: React Query for server state.
- **UI Components**: Custom components built with Radix UI primitives and Shadcn UI.
- **Form Handling**: React Hook Form with Yup validation.
- **Animations**: Framer Motion for smooth transitions.

### 📐 Architecture

The application follows a clean architecture pattern with:

- **Components**: Reusable UI components with clear separation of concerns.
- **Services**: API integration layer for backend communication.
- **Hooks**: Custom hooks for shared functionality.
- **Utils**: Utility functions and helpers.
- **API Routes**: Backend endpoints for data management.

### 🚀 Performance Considerations

- Implemented image optimization using **Next.js Image component**.
- Efficient data fetching with **React Query caching**.
- Lazy loading of images and components.
- Debounced scroll handlers for better performance.

### 🔒 Security Features

- Rate limiting on API endpoints.
- Input validation and sanitization.
- Secure image upload handling using **UploadThing**.
- Error boundary implementation.

## 🚀 Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/agusgrance/memory-lane
   ```
2. Install dependencies:
   ```sh
   yarn
   ```
3. Create a `.env` file based on `.env.example` and configure environment variables.
4. Start the development server:
   ```sh
   yarn dev
   ```
5. Start the API server:
   ```sh
   yarn serve:api
   ```

## 📡 API Endpoints

- `GET /memories`: Fetch paginated memories.
- `POST /memories`: Create new memory.
- `PUT /memories/:id`: Update existing memory.
- `DELETE /memories/:id`: Delete memory.
- `GET /users/current`: Get current user.
- `PUT /users/current`: Update user profile.

## 📸 Screenshots

![Memory Lane](./public/screenshots/memory-lane.png)
![Edit Memory](./public/screenshots/edit-memory.png)
![Edit Profile](./public/screenshots/edit-profile.png)

## 🎥 Video Demo

[Memory Lane Demo](https://www.loom.com/share/d767b8f01e664e7a990e4c58a4e66ede?sid=9b4a69d5-6f50-4fb3-a815-492a2321d9e6)
