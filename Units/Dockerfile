# Build environment
FROM node:alpine as build
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

RUN npm install
RUN npm install -g react-scripts
COPY . /app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "serve"]