# generator-jhipster-custom-server-side-blueprint
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster blueprint, The main goal is to slight change how the code and test from Entity, Service, Mapper, DTO and Controller are generated.

# Introduction

This is a [JHipster](https://www.jhipster.tech/) blueprint, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](https://www.jhipster.tech/) blueprint, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://www.jhipster.tech/installation/)

# Installation

## With NPM

To install this blueprint:

```bash
npm install -g generator-jhipster-custom-server-side-blueprint
```

To update this blueprint:

```bash
npm update -g generator-jhipster-custom-server-side-blueprint
```

## With Yarn

To install this blueprint:

```bash
yarn global add generator-jhipster-custom-server-side-blueprint
```

To update this blueprint:

```bash
yarn global upgrade generator-jhipster-custom-server-side-blueprint
```

# Usage

To use this blueprint, run the below command

```bash
jhipster --blueprints custom-server-side-blueprint
```


## Running local Blueprint version for development

During development of blueprint, please note the below steps. They are very important.

1. Link your blueprint globally 

Note: If you do not want to link the blueprint(step 3) to each project being created, use NPM instead of Yarn as yeoman doesn't seem to fetch globally linked Yarn modules. On the other hand, this means you have to use NPM in all the below steps as well.

```bash
cd custom-server-side-blueprint
npm link
```

2. Link a development version of JHipster to your blueprint (optional: required only if you want to use a non-released JHipster version, like the main branch or your own custom fork)

You could also use Yarn for this if you prefer

```bash
cd generator-jhipster
npm link

cd custom-server-side-blueprint
npm link generator-jhipster
```

3. Create a new folder for the app to be generated and link JHipster and your blueprint there

```bash
mkdir my-app && cd my-app

npm link generator-jhipster-custom-server-side-blueprint
npm link generator-jhipster (Optional: Needed only if you are using a non-released JHipster version)

jhipster -d --blueprints custom-server-side-blueprint

```

# License

Apache-2.0 © [Renan Franca](https://br.linkedin.com/in/renan-af)


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-custom-server-side-blueprint.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-custom-server-side-blueprint
[travis-image]: https://travis-ci.org/renanfranca/generator-jhipster-custom-server-side-blueprint.svg?branch=main
[travis-url]: https://travis-ci.org/renanfranca/generator-jhipster-custom-server-side-blueprint
[daviddm-image]: https://david-dm.org/renanfranca/generator-jhipster-custom-server-side-blueprint.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/renanfranca/generator-jhipster-custom-server-side-blueprint
