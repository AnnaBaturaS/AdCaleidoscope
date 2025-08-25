# 🎨 AdCaleidoscope Creative OS

> *Turning creative chaos into performance patterns*

[![AWS Hackathon](https://img.shields.io/badge/AWS-Generative%20AI%20Hackathon-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/bedrock/)
[![Nova Models](https://img.shields.io/badge/Amazon-Nova%20Models-232F3E?style=for-the-badge&logo=amazon&logoColor=white)](https://aws.amazon.com/bedrock/nova/)

**🏆 AWS Generative AI Hackathon Project**  
*Created during AWS Workshop Studio - Generative AI Hackathon*

**AdCaleidoscope** is an AI-powered creative management platform that transforms how mobile advertising teams create, analyze, and optimize their campaigns. Like a kaleidoscope that reveals beautiful patterns from fragments, AdCaleidoscope discovers winning creative patterns from your campaign data.

Built specifically to showcase the power of **Amazon Nova models** in a real-world creative workflow, demonstrating how AI can revolutionize mobile advertising creative processes.


## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LOCAL MODE    │    │   CLOUD MODE    │    │   ANALYTICS     │
│                 │    │                 │    │                 │
│ • LocalStack    │◄──►│ • AWS Bedrock   │◄──►│ • In-Memory     │
│ • Mock Services │    │ • Real AI Gen   │    │ • Performance   │
│ • Development   │    │ • Production    │    │ • Insights      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **AI Generation**: Amazon Nova Pro/Canvas/Reel models
- **Analytics**: In-memory analytics with comprehensive mock data  
- **Infrastructure**: AWS Bedrock (real AI) + optional LocalStack (dev)
- **Storage**: Hybrid local files + S3 with smart switching
- **UI**: shadcn/ui components + Monaco Editor
- **Playables**: MRAID 3.0 sandbox with interactive games


## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- AWS credentials (for Bedrock API)

### Setup

1. **Clone and install dependencies:**
```bash
git clone <repo>
cd adcaleidoscope
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env.local
# Edit .env.local with your AWS Bedrock credentials
```

3. **Start the application:**
```bash
npm run dev
```

Open http://localhost:3000



## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/           # KPIs and overview
│   ├── library/            # Creative management
│   ├── briefs/            # Brief builder with Monaco Editor
│   ├── playground/        # MRAID sandbox
│   ├── patterns/          # Pattern analysis
│   ├── experiments/       # A/B testing
│   ├── settings/          # Provider configurations
│   └── api/
│       ├── brief/         # Nova Pro integration
│       ├── generate/      # Nova Canvas/Reel
│       ├── analytics/     # Analytics endpoints
│       └── upload-url/    # S3 presigned URLs
├── lib/
│   ├── aws.ts            # AWS SDK clients with LOCAL/CLOUD switching
│   ├── analytics/        # Analytics integration
│   ├── providers/        # AI generation providers
│   └── utils/           # S3 upload, schemas, templates
└── components/          # Reusable UI components
```


## 🎯 User Journey

```mermaid
graph TD
    A[🏢 Choose Brand<br/>Select from 8 detailed<br/>brand profiles] --> B[🎯 Smart Matching<br/>AI finds relevant creatives<br/>by keywords & demographics]
    
    B --> C[📝 Generate Brief<br/>Nova Pro creates<br/>comprehensive brief]
    
    C --> D{🎨 Create Content}
    D --> E[🖼️ Nova Canvas<br/>High-quality images]
    D --> F[🎬 Nova Reel<br/>Engaging videos]
    D --> G[🎮 MRAID Games<br/>Interactive playables (planned)]
    
    E --> H[📊 Performance Analysis<br/>Analytics dashboard with<br/>mock campaign data]
    F --> H
    G --> H
    
    H --> I[🔄 Optimize & Iterate<br/>Apply insights to<br/>next campaign]
    I --> A
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style H fill:#e8f5e8
    style I fill:#fff3e0
```



## 🚀 **Getting Started - 5 Minutes**

Want to see AdCaleidoscope in action? Follow this quick demo:

1. **Start the app**: `npm run dev`
2. **Explore Brand Books**: Navigate to `/brandbooks` and browse 8 detailed brand profiles
3. **Create a Brief**: Go to `/briefs/new` and select "Business Empire" or any brand
4. **See Smart Matching**: Watch AI match relevant creatives by keywords
5. **Generate**: Click "Generate from Brief" to see Nova Pro in action
6. **Test Playables**: Visit `/playground` to try interactive MRAID games
7. **Analyze Performance**: Check `/patterns` for comprehensive analytics dashboard




---

*AdCaleidoscope - Where Creative Chaos Becomes Performance Patterns* 🎨
