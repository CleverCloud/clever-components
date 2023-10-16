---
kind: '👋 Contributing'
title: 'Release'
---

# How to release the components?

## Release phase

Release is automated with [release-please](https://github.com/googleapis/release-please).
Basically, a GitHub Pull Request is maintained by a GitHub action.
This Pull Request contains the modification for the next release.
Merging the release Pull Request will perform the release:

* Generation of the CHANGELOG.md
* Bump of the version number in the package.json
* Commit and add git tag

### Hotfix

Standard releases are done on the `master` branch.
If you need a Hot fix release, you must do the modification on a branch using `hotfix/` prefix.
For instance, a branch named `hotfix/9.0.x` will have a dedicated release PR maintained by release-please.

## Publishing phase

Clever components are published on two systems:

* Package on npmjs.com
* CDN on Clever Cloud

Both publications are done automatically by a dedicated GitHub action.
But you still can perform them manually.

### Publish Package on npmjs.com

You must get the fresh released code:

```sh
VERSION=${version} && git fetch --tags origin "$VERSION" && git checkout "$VERSION" && git reset --hard "$VERSION"
```

Then you must install dependencies:

```sh
npm ci
```

Publishing on npmjs.com (stable):

```sh
npm publish --access public
```

Publishing on npmjs.com (beta):

```sh
npm publish --access public --tag beta
```

### Publish CDN on Clever Cloud

CDN is hosted on Clever Cloud in a dedicated Cellar bucket.
Publishing to Cellar requires two secrets:
* SMART_CDN_CELLAR_KEY_ID
* SMART_CDN_CELLAR_SECRET_KEY

You must get the fresh released code:

```sh
(export VERSION=${version} && git fetch --tags origin "$VERSION" && git checkout "$VERSION" && git reset --hard "$VERSION")
```

Then you must install dependencies:

```sh
npm ci
```

Then you must build the CDN with:

```sh
(export VERSION=${version} && npm run cdn-release:build)
```

Publication is done with:

```sh
(export VERSION=${version} && export SMART_CDN_CELLAR_KEY_ID=${***} && export SMART_CDN_CELLAR_SECRET_KEY=${***} && npm run cdn-release:publish "${VERSION}")
```
