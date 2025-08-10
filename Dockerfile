# Use the official Node.js image as the base image
FROM node:23-alpine3.20

# Declare the build-time variable
ARG NEXT_PUBLIC_API_URL

# Set it as an environment variable (important for Next.js during build)
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application with the injected env
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Start the Next.js application
CMD ["npm", "start"]