# Contributing

## Local development requirements

Setting up the project for local development will require all of the following the be installed:

- [git](https://git-scm.com/) (version `2.39` or higher)
- [node](https://nodejs.org/en) (version `18.0` or higher)

## Setting up for development

Setting up the project will require that the above dependencies are all installed. After which you can run the following commands:

```sh
# Enable corepack, it is disabled by default in the supported versions of NodeJS
corepack enable
# Prepare corepack based on the packageManager specified in the projects package.json
corepack prepare
# Install all dependencies
pnpm install
# Build the project (generate the code based on words lists)
pnpm build
```

#### Running formatting, linting, and checking

Running formatting on the project can be done using the following command:

```sh
pnpm format
```

Running linting on the project can be done using the following command:

```sh
pnpm lint
```

Running type checking on the project can be done using the following command:

```sh
pnpm typecheck
```

## Fixing bugs

If you plan to fix a bug with the project, please start by putting in a bug report issue in the GitHub repository.

## Adding features

If you plan to add a new feature to the project, please start by putting in a feature request issue in the GitHub repository. This will ensure tracking of the feature request, as well as provide information about what you are attempting to implement.

After developing a new feature it is important that you test it thoroughly locally first before submitting a pull request.
