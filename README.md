# DSBD-API 
The interface for executing binaries on morello board and self that returns output which can be processed by the client.

## Local
Update your local.json to contain a variable for your QEMU morello-purecap system **morello_host.address**. File mmight not be created just yet, so you would need to create one in `./config/` folder and add a new properrty, please look at the `degault.json` on how other variables are configured.
```sh
 # 1. install dependenciees
npm i
 # 2. generate swagger and route files for Open API
npm run build
 # 3. start service in dev mode. In order to start in full - npm start" 
npn run dev
```

> Generate an ssh token and upload onto host machine

> Start in dev mode
```sh
```

## Tests
So far we have two tests **unit** and **integration** each could be executed by calling the below commands
```sh
npm run test:integration
npm run test:unit
```

To be updated....