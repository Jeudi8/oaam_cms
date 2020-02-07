# Oman Museum CMS

## Description

Installation, deployment, requirement about Directus CMS and your App.

## Project Structure

- ./app (_your final app go here_)
- ./config (_nodejs process to setup, build and deploy for every projects_)
- ./data (_data from directus_)
- ./dist (_created on the fly and final folder of your build_)
- .env (_environnement variables for nodejs_)
- .gitignore
- docker-compose.yaml (_docker procedure_)
- package.json
- README.INSTALL.md (_installation procedure for the museum_)
- README.md

## Requirement

- all os : nodejs, yarn (optionnal).
- linux : docker, docker-compose.
- windows and macos : docker desktop.

Don't forget, your app will be deployed on Windows 10 professionnal.

## Installation

- start docker and wait until its running.
- cd to `./oman-cms`.
- `docker-compose pull`
- `docker-compose up -d`
- wait until containers are up, check this by running `docker ps`
- `docker-compose run directus install --email admin@oaam.com --password admin@oaam.com` (don't override
  it for now)
- `yarn install` or `npm install`
- `yarn setup` or `npm run setup`
- open your web-browser and go to http://localhost:8765
- sign in with admin@oaam.com (email and pwd).

## CMS

###### Scripts

- start : `docker-compose up`
- deamon mode : `docker-compose up -d`
- stop : `docker-compose stop`

###### Docs

- [Official docs](https://docs.directus.io/getting-started/introduction.html)
- communication between your app and directus can be done through
  [RESTful and GraphQL request](https://docs.directus.io/api/reference.html). Directus provide a
  [javascript SDK](https://docs.directus.io/guides/js-sdk.html#installation) also.

###### Users and roles

- Be aware that the defaults logins can changes.
- Administrator (you) : default administrator for every project. It can be overrided in Directus but you
  will have to update it in .env file (OAAM_ADMIN_MAIL, OAAM_ADMIN_PWD) with your new values. We will not
  recommended to do so, in case we have to access the CMS on site.
- OAAM Editor: the editor from the museum is already created (user "editor@oaam.com"). Don't forget to
  give him permissions/restrictions to whatever he can change or not in your app.

## Build and Deploy

- Build your .exe app.
- Past your app installer in ./app folder.
- Set your appId in .env file (OAAM_APP_ID).
- `yarn build` or `npm run build`
- This while create a .zip file in ./dist folder.
