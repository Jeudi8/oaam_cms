# Oman Museum CMS

## Description

Installation, deployment, requirement about Directus CMS and your App.

## Project Structure

- ./app (_your final app go here_)
- ./data (_data from directus_)
- ./setup (_setup default users/tables/files/etc.. for every projects_)
- ./docker-compose.yaml (_docker procedure_)

## Installation

- install Docker. Follow the official procedure for your OS. Don't forget, your app will be deployed on
  windows 10 professionnal.
- start docker and wait until its running.
- open a terminal and navigate to your folder.
- enter command `docker-compose pull`
- enter command `docker-compose up -d`
- wait until containers are up, check this by running `docker ps`
- enter command : `docker-compose run directus install --email admin@oman.com --password admin@oman.com`
  (_default admin for everyone, can be override after installation done_)
- navigate to `cd ./setup`
- enter command `yarn install` or `npm install`
- enter command `yarn setup` or `npm run setup`
- open your web-browser
- nagivate to (http://localhost:8765)
- sign in with : admin@oman.com (email and pwd).

## CMS

###### Scripts

- start : `docker-compose up`
- start in deamon mode: `docker-compose up -d`
- stop : `docker-compose stop`

###### Docs

- [Official docs](https://docs.directus.io/getting-started/introduction.html)
- communication between your app and directus can be done through
  [RESTful and GraphQL request](https://docs.directus.io/api/reference.html). Directus provide a
  [javascript SDK](https://docs.directus.io/guides/js-sdk.html#installation) also.

###### Museum administrator

- The admin and role from the museum is already created (user "Museum Admin", role "Museum
  Administrator"). Don't forget to give him access to whatever he can change in your app.

## Build and Deploy

- build your .exe app.
- past your app and its assets in ./app folder.
- enter command : `cd ./config`
- enter command : `yarn build --app your-app-id` or `npm run build --app your-app-id`
- this while create a .zip file in ./dist folder (in root project).
