# Oman installation procedure

## Description

How provide Directus CMS and your App for the museum.

## Project Structure

- ./app
- ./data
- ./docker-compose.yaml

## Installation

### 1.Docker

- follow the offical procedure for your OS. Don't forget, your app will be deployed on windows 10
  professionnal.
- start docker and wait until its running
- open a terminal and enter :

```
docker-compose pull
docker-compose up -d
```

### 2.CMS

- open you browser
- nagivate to (http://localhost:8080) (user and pwd : default@admin.com)

### 3.Build

- build your .exe app
- past your app and its assets in ./app folder
- compress all in .zip and name it with the app id provided by the museum
- upload it at ....
