# OAAM CMS

## Description

Requirements, installation and packaging about Directus CMS and your App.

## Project Structure

- ./config (_nodejs process to setup, package and deploy for every projects_)
- ./data (_created on the fly, data from directus_)
- ./dist (_created on the fly, final folder of your package (app + directus)_)
- ./src (_do wathever you want here_)
- .gitignore
- package.json (_you can override the data under "oaam"_)
- ...other files (_can't be overrided_)

## Installation requirement

- all os : nodejs, yarn (optionnal).
- linux : docker, docker-compose.
- windows and macos : docker desktop.

Don't forget, your app will be deployed on Windows 10 professionnal.

## Installation

- start docker (if not) and wait until its running.
- navigate to this folder.
- `docker-compose pull`
- `docker-compose up -d` (wait until containers are up, check this by running `docker ps`)
- `docker-compose run directus install --email admin@oaam.com --password admin@oaam.com` (don't override
  it)
- `yarn` or `npm install`
- `yarn setup` or `npm run setup`
- go to http://localhost:8765
- sign in with admin@oaam.com (email and pwd).

## Packaging

Process to grab all needed files and folders for production, and package them to .zip file.  
In package.json under "oaam", set your "app_id" and your "app_build" (relative path to your exe file) and
run :

- `yarn package` or `npm run package`

This will create a zip file in ./dist. Filename is composed of `<app-id>-<date>.zip`.  
You can test yout production build by decompressing the .zip and fallow the procedure of
README.INSTALL.md.

## CMS

###### Scripts

- start : `docker-compose up`
- start in deamon mode : `docker-compose up -d`
- stop : `docker-compose stop`

###### Log in

- open your web-browser and go to http://localhost:8765
- sign in with admin@oaam.com (email and pwd).

###### Docs

- [Official docs](https://docs.directus.io/getting-started/introduction.html)
- communication between your app and directus can be done through
  [RESTful and GraphQL request](https://docs.directus.io/api/reference.html). Directus provide a
  [javascript SDK](https://docs.directus.io/guides/js-sdk.html#installation) also.

###### Users and roles

- Administrator (you) : default administrator for every project. It can be overrided in Directus but you
  will have to update it in .env file (OAAM_ADMIN_MAIL, OAAM_ADMIN_PWD) with your new values. We will not
  recommended to do so, in case we have to access the CMS on site.
- OAAM Editor: the editor from the museum is already created (user "editor@oaam.com"). Don't forget to
  give him permissions/restrictions to whatever he can change or not in your app.
