# KMAP (AMOS SS 2021)
![GitHub](https://img.shields.io/github/license/amosproj/amos-ss2021-project2-context-map)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/amosproj/amos-ss2021-project2-context-map)
![GitHub branch checks state](https://img.shields.io/github/checks-status/amosproj/amos-ss2021-project2-context-map/main)
![GitHub forks](https://img.shields.io/github/forks/amosproj/amos-ss2021-project2-context-map?style=social)

![Logo](./content/AMOS_KMAP_LOGO_THUMBNAIL.png)

Welcome to the KMAP repository. This repository contains the source code and the documentation of the KMAP project.  
This project is created in cooperation with the [CPU 24/7 GmbH](https://engineeringcloud.io/en/).

## Project vision
The contexmap for corporate data KMAP helps companies worldwide to automatically turn company data into valuable insights. By leveraging modular visualizations, we empower the corporate customers throughout the enterprise to find answers to business related questions without deeper coding knowledge. A responsive step-by-step exploration facilitates quick access to the insights needed. KMAP furthers the communication and transparency across companies and along the value-chain.  

## AMOS
This project was created as a university project and is part of the set of AMOS projects hosted by the [Professorship for Open Source Software](https://oss.cs.fau.de/) at the [University of Erlangen-Nuremberg](https://www.fau.eu/).

## Current development
Current development concentrates on creating a minimum viable product for KMAP. Core functionality will be integrating graph data bases, visualizing the graph data in a modular dashboard, and exploring the data with a no-code query builder.

## How to build
### Prerequisites
> :warning: **Make sure to clone the repository with LF line ending applied when working on windows** 
1. Clone the repository via  
`git clone https://github.com/amosproj/amos-ss2021-project2-context-map.git`

1. Install node from [https://nodejs.org/en/](https://nodejs.org/en/) and make sure to add your installation directory to PATH.   
It is required to install node with version 12.x or higher.

1. Install docker from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/).

1. Install `yarn` by running  
`npm i -g yarn`

### Run the project
1. Make sure that docker is running.
2. Navigate to the `/build` directory within the repository clone.
3. Run `node start-database`. A new docker container with the name `neo4j-db` should run now. If it is only created, but does not run, run the container (you can check if the container is running with the command `docker ps` in your terminal).

#### Windows and platforms with powershell installed

Run each of the scripts in the following order within a separate shell instance.
```
4. .\start-backend-dbg.ps1 
5. .\start-frontend-dbg.ps1
```

#### Linux and Mac

Run each of the scripts in the following order.
```
4. ./start-backend-dbg.sh & 
5. ./start-frontend-dbg.sh &
```

Once database, backend and frontend were built for one time, the backend and frontend can also be started by running 
```
[4.] node start-backend-detached
[5.] node start-frontend-detached
```

### How to deploy
To deploy the project execute the deploy script in the repository root directory after cloning.  
When working on windows, execute the `deploy.ps1` script, on linux and MacOs, run the `deploy.sh` script.  
The deployment artifacts are copied to the `artifacts` folder in the repository root.   

To execute the deployment artifacts on the target machine follow tese steps:  
1. Make sure that docker is installed on the target machine. If not, install it as described in [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)  
If the target machine runs with windows, make sure that docker is running with `Linux containers`. 
3. Copy the content of the `artifacts` folder to the target machine.
4. Execute the `kmap` script to run the software on the target machine.  
On linux machines, execute the `kmap.sh` script, on windows machines the `kmap.ps1` script.

## Demo
A public demo of the project is available at [http://141.144.244.57/](http://141.144.244.57/).
