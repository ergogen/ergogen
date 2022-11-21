# scad-api

[![GitHub version](https://badge.fury.io/gh/jscad%2Fscad-api.svg)](https://badge.fury.io/gh/jscad%2Fscad-api)
[![EXPERIMENTAL](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)
[![Build Status](https://travis-ci.org/jscad/scad-api.svg?branch=master)](https://travis-ci.org/jscad/scad-api)
[![Dependency Status](https://david-dm.org/jscad/scad-api.svg)](https://david-dm.org/jscad/scad-api)
[![devDependency Status](https://david-dm.org/jscad/scad-api/dev-status.svg)](https://david-dm.org/jscad/scad-api#info=devDependencies)


> OpenSCAD like modeling API for OpenJSCAD

This package provides [OpenSCAD](http://www.openscad.org/) functionality for [OpenJSCAD](openjscad.org) & Co.

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Background

This package provides an opinionated API that tries to mimic (up to a point) that of [OpenSCAD](http://www.openscad.org/). Currently, this package uses the [CSG.js](https://github.com/jscad/csg.js) library to implement most functionality.

This package was part of [OpenJSCAD.ORG](https://github.com/Spiritdude/OpenJSCAD.org) but is now an 'independent' module in the JSCAD organization. Hopefully, this makes usage and development easier.

It gives you ONE variant of syntaxic sugar/ flavor to do solid modeling.

It is using semantic versioning to signal minor and breaking changes.

## Installation

```
npm install @jscad/scad-api
```

## Usage

This package is included by default in [OpenJSCAD.org](http://openjscad.org/) but you can also use it 'standalone'.

```javascript
const scadApi = require('@jscad/scad-api')

const {cube, sphere} = scadApi.primitives3d
const {union} = scadApi.booleanOps

const base = cube({size: 1, center: true})
const top = sphere({r: 10, fn: 100, type: 'geodesic'})

const result = union(base, top)

```

## API

The API documentation (incomplete) can be found [here](./docs/api.md)
For more information, see the [OpenJsCad User Guide](https://en.wikibooks.org/wiki/OpenJSCAD_User_Guide).

For questions about the API, please contact the [User Group](https://plus.google.com/communities/114958480887231067224)

>NOTE: at this time combined union() of 2d & 3d shapes is not **officially** supported
but still possible via union({extrude2d: true}, op1, op2) this might change in the future

## Contribute

This library is part of the JSCAD Organization, and is maintained by a group of volunteers. We welcome and encourage anyone to pitch in but please take a moment to read the following guidelines.

* If you want to submit a bug report please make sure to follow the [Reporting Issues](https://github.com/jscad/scad-api/wiki/Reporting-Issues) guide. Bug reports are accepted as [Issues](https://github.com/jscad/scad-api/issues/) via GitHub.

* If you want to submit a change or a patch, please see the [Contributing guidelines](https://github.com/jscad/scad-api/blob/master/CONTRIBUTING.md). New contributions are accepted as [Pull Requests](https://github.com/jscad/scad-api/pulls/) via GithHub.

* We only accept bug reports and pull requests on **GitHub**.

* If you have a question about how to use CSG.js, then please start a conversation at the [OpenJSCAD.org User Group](https://plus.google.com/communities/114958480887231067224). You might find the answer in the [OpenJSCAD.org User Guide](https://github.com/Spiritdude/OpenJSCAD.org/wiki/User-Guide).

* If you have a change or new feature in mind, please start a conversation with the [Core Developers](https://plus.google.com/communities/114958480887231067224) and start contributing changes.

Small Note: If editing the Readme, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.


## License

[The MIT License (MIT)](https://github.com/jscad/scad-api/blob/master/LICENSE)
(unless specified otherwise)

NOTE: OpenSCAD and OpenSCAD API are released under the General Public License version 2.
