# Contributing to College Ecosystem

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to the College Ecosystem project. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [email@example.com](mailto:email@example.com).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for College Ecosystem. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating a bug report, please check if an issue already exists.

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/your-repo/college-ecosystem/issues).
- **If you're unable to find an open issue addressing the problem,** open a new one.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for College Ecosystem, including completely new features and minor improvements to existing functionality.

Before creating an enhancement suggestion, please check if an issue already exists.

- **Ensure the enhancement was not already suggested** by searching on GitHub under [Issues](https://github.com/your-repo/college-ecosystem/issues).
- **If you're unable to find an open issue addressing the suggestion,** open a new one.

### Pull Requests

The process described here has several goals:

- Maintain the quality of the codebase
- Fix bugs or introduce new features
- Discuss code changes

Please follow these steps:

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 14
- [Yarn](https://yarnpkg.com/)
- [Go](https://golang.org/) (if applicable)

### Initial Setup

To get started with the College Ecosystem on your local machine, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/kanakkholwal/college-ecosystem.git
cd college-ecosystem

```

### Install Dependencies

```bash
yarn install
# or
npm install
```

This command installs dependencies for all projects defined in the apps directory.

#### For individual projects

```bash
npm install --workspace=platform
```

#### Specific package

```bash
npm install some-package --workspace=platform
```

## Usage

### Running Projects/Apps (app/*)

To run individual projects locally:

```bash
yarn workspace [app-name] run dev
# or
npm run --workspace=[app-name] dev
# or
turbo dev --filter=[app-name]
# e.g.
turbo dev --filter=platform

```

### Building Projects/Apps (app/*)

To build individual projects for production:

#### Platform

```bash
yarn workspace [app-name] run build
# or
npm run --workspace=[app-name] build
# or
turbo build --filter=[app-name]
# e.g.
turbo build --filter=platform

```

### Running Turbo Commands

To utilize Turbo Repo for optimized workflows:

```bash
yarn turbo run [command]
# or 
npm run [command]
# or 
turbo [command]
```

Replace [command] with `build`, `dev`, `lint`, or `test` as needed.

## Scripts

The root `package.json` file defines scripts for common tasks:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
        "format": "prettier --write \"**/*.{ts,tsx,js,jsx,md}\"",
  }
}
```
