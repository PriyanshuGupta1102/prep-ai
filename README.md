# PrepAI - AI-Powered Interview Coach

PrepAI is an AI-powered interview preparation application that uses Vapi AI for voice interactions and Google's Gemini for interview analysis.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Deployment Scripts

This project includes two scripts to help with deployment:

### build.sh
Builds the application for production deployment.

### run.sh
Runs the built application in production mode.

## Setup Instructions

### For Deployment Services (like Render)

1. Clone the repository to your deployment service
2. Ensure your deployment service runs the `build.sh` script during the build process
3. Set the following environment variables in your deployment service:
   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY` - Your Vapi public key
   - `NEXT_PUBLIC_VAPI_ASSISTANT_ID` - Your Vapi assistant ID
   - `NEXT_PUBLIC_GEMINI_API_KEY` - Your Google Gemini API key

### Manual Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd prep-ai
   ```

2. Make the scripts executable:
   ```bash
   chmod +x build.sh run.sh
   ```

3. Create a `.env.local` file with your API keys:
   ```bash
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
   NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Run the build script:
   ```bash
   ./build.sh
   ```

5. To run the application locally in production mode:
   ```bash
   ./run.sh
   ```

## Environment Variables

The application requires the following environment variables:

- `NEXT_PUBLIC_VAPI_PUBLIC_KEY`: Your Vapi AI public key
- `NEXT_PUBLIC_VAPI_ASSISTANT_ID`: Your Vapi AI assistant ID
- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API key

## For Deployment Services like Render

When deploying to services like Render:

1. Set the build command to: `./build.sh`
2. Set the start command to: `./run.sh`
3. Add the required environment variables in the deployment settings

## Development

For development, you can run:

```bash
npm install
npm run dev
```

This will start the development server on `http://localhost:3000`.

## Technologies Used

- Next.js
- React
- TypeScript
- Vapi AI
- Google Gemini
- Tailwind CSS
