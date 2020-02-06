# Oman installation procedure

## Description

Installation, deployement, requirement about Directus CMS and your App.

## Project Structure

- ./app _your final app go here_
- ./data _data from directus_
- ./docker-compose.yaml _docker procedure_

## Installation

- follow the offical procedure for your OS. Don't forget, your app will be deployed on windows 10
  professionnal.
- start docker and wait until its running.
- open a terminal and navigate to your folder.
- enter scripts :`docker-compose pull && docker-compose up -d`
- wait until containers are up
- enter scripts : `docker-compose run directus install --email admin@oman.com --password admin@oman.com`
  (_default admin for everybody_)
- open your web-browser
- nagivate to (http://localhost:8765)
- sign in with : admin@oman.com (email and pwd).

## Deployement

- build your .exe app
- past your app and its assets in ./app folder
- compress all in .zip and name it with the app-id provided by the museum
- upload it at ....

## CMS

###### Scripts

- start : `docker-compose up`
- start in deamon mode: `docker-compose up -d`
- stop : `docker-compose stop`

###### Infos

- the docs : (https://docs.directus.io/installation/docker.html)
- The admin from the museum is already created (user "Museum Oman"). He got the role of "Administrator
  Museum". Don't forget to give him access to whatever he can change in your app. Email and pwd are
  already set : museum@oman.com for both.
- communication between your app and directus can be done through REST and Graphql request. Directus
  provide a javascript SDK also.
