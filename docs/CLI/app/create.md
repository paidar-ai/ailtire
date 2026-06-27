---
layout: default 
title: ailtire app create 
permalink: cli-app-create 
parent: ailtire app 
grand_parent: Command Line Interface
has_children: false
---

# ailtire app create

Create an application in the ailtire framework.

## Synopsis

```shell
# Create a ailtire application  in the specified directory.
ailtire app create --name <app name> --dir <Directory path>

# Created a ailtire application in the current directory.
ailtire app create --name <app name>

# Create and bootstrap a developer identity.
ailtire app create --name <app name> --bootstrap-dev --identifier <id> --secret <secret>
```

## Description

The command creates an application directory structure for the application created. If the --dir parameter is included
the path is used as the base directory for the application. If it is not included then the current directory will be
used as the location where a new directory will be created with the name of the application.

If `--bootstrap-dev` is provided, or you confirm the prompt in an interactive terminal, the CLI will register a
developer identity and log it in so follow-up commands can run immediately.

For more information about the directory structure see the [Directory Page](directory).

## Generated Artifacts

This application base directory is the location to store all information about design and architecture of the
application.

```shell
./actors # Actors of the application
./api # the solution stack of the application.
./api/index.js # Definition of the application
./api/doc # Additional Documentation of the application
./api/handlers # Event handlers for the paplication. 
./api/interface # Interface for the application.
./api/MyPackage # packges of the application.
./assets # Assets used for the webinterface.
./bin # commond line interfacae for the application
./deploy # deployment strategy for the application
./docs # generated documentation. do not touch this.
./test # Test suites for the application
./views # customized views for the webinterface.
./index.js # entry point to staart the application. Use npm start.
./package.json # nodejs package.json file for target and dependencies.
```

The api directory contains an index.js file that defines the application.

```javascript
// <app name>/index.js

module.exports = {
    name: 'Application Developer',
    shortname: 'appdev',
    description: 'The Application Developer work in coordination with DevOps to manage services,' +
        ' applications and workloads through the development pipeline.'
};
```

If additional documentation about the application is needed you can create a [doc directory](documentation) api/doc
and add additional documentation there.

## See Also

* [ailtire app](cli-app)
