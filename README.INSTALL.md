# Interactive

## Description

Installation of an interactive in Oman's Museum.

## Project Structure

- app-file.exe
- ./cms (_data from CMS, don't touch it_)

## Requirement

Docker Desktop, Windows 10 Professionnal.

## Installation

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Launch it and wait until its running
- Open a terminal, navigate back here and enter:
- `cd /cms`
- `docker-compose pull`
- `docker-compose up -d` (Wait until containers are up, check them by running `docker ps`)
- Double click on .exe file

## Launch if computer restart

- Double click on .exe file

## Acces the CMS

- open your web-browser and go to http://localhost:8765
- Sign in with editor@oman.com (email and password)
