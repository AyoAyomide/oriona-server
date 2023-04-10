FROM node:16.20-alpine3.17

# install ffmpeg
RUN apk upgrade -U && apk add ffmpeg

# setup user
RUN addgroup -S app && adduser -S app -G app
USER app

WORKDIR /home/app

# copy dependencies config files
COPY --chown=app:app package.json package-lock.json ./

# install dependencies
RUN npm install
COPY --chown=app:app . .

EXPOSE 8080
CMD ["npm","start"]