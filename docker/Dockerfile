FROM node:15.5.0

EXPOSE 8080
# Copy local code to the container image.
COPY ../build /src
COPY ../package*.json /src

WORKDIR /src

RUN npm install
CMD [ "node", "server.js" ]
