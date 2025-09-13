# ML Fraud Detection Frontend

A modern, real-time fraud detection dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This frontend connects to a machine learning backend to provide instant fraud analysis on credit card transactions.

## 🚀 Features

### 🔍 **Manual Analysis**
- Real-time fraud detection using deployed ML model
- Test with legitimate, fraudulent, or random transactions
- Detailed feature analysis showing ML decision factors
- Interactive expandable transaction details
- Professional animations and smooth transitions

### 📊 **Live Transaction Feed**
- Real-time WebSocket connection to ML backend
- Live transaction stream with instant fraud detection
- Expandable transaction cards with full analysis
- Connection status monitoring and error handling
- Automatic reconnection with exponential backoff

### 🎨 **UI/UX Excellence**
- Clean, professional dark/light theme support
- Smooth animations and micro-interactions
- Responsive design for all screen sizes
- Comprehensive error handling with user feedback
- Loading states and connection indicators

### 🔧 **Technical Features**
- Full TypeScript implementation
- Backend API integration with proper error handling
- Environment variable configuration
- Production-ready build optimization
- Modern React patterns and hooks

## 🛠 Tech Stack

- **Framework:** Next.js 15 with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Backend Integration:** RESTful API + WebSocket
- **State Management:** React Hooks
- **Build Tool:** Next.js with optimized bundling

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Access to the ML backend API

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbhayManikanti/MLFraudFrontend.git
   cd MLFraudFrontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-ml-backend-url.com
   NEXT_PUBLIC_WS_URL=wss://your-ml-backend-url.com
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📡 Backend Integration

This frontend is designed to work with a FastAPI ML backend that provides:

### API Endpoints
- `GET /random_transaction` - Retrieve random transaction data
- `POST /predict_original` - Get fraud predictions from ML model
- `WebSocket /ws/live_feed` - Real-time transaction stream

### Data Flow
1. Frontend requests transaction data from backend
2. ML model processes transaction features (V1-V28, Amount)
3. Backend returns fraud probability and feature importance
4. Frontend displays results with detailed analysis

## 🏗 Project Structure

```
src/
├── app/                    # Next.js app router
├── components/
│   ├── dashboard/          # Main dashboard components
│   │   ├── manual-analysis.tsx
│   │   ├── live-feed.tsx
│   │   └── ...
│   ├── ui/                 # Reusable UI components
│   └── layout/             # Layout components
├── lib/
│   ├── fraud-api.ts        # Backend API client
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
└── hooks/                  # Custom React hooks
```

## 🎯 Key Components

### Manual Analysis (`manual-analysis.tsx`)
- Interactive fraud testing interface
- Real ML model integration
- Detailed feature importance display
- Transaction parameter visualization

### Live Feed (`live-feed.tsx`)
- WebSocket connection management
- Real-time transaction streaming
- Expandable transaction details
- Connection status monitoring

### API Client (`fraud-api.ts`)
- TypeScript interfaces for backend data
- Error handling and retry logic
- WebSocket connection management
- Health check functionality

## 📊 Machine Learning Integration

The frontend seamlessly integrates with ML models that analyze:

- **Transaction Features:** V1-V28 (PCA-transformed features)
- **Amount:** Transaction value
- **Fraud Probability:** Model confidence score
- **Feature Importance:** Top influencing factors
- **Risk Assessment:** Real-time fraud detection

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_BASE_URL=https://your-production-backend.com
NEXT_PUBLIC_WS_URL=wss://your-production-backend.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for real-time fraud detection**
