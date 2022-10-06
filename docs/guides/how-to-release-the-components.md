---
kind: 📌 Docs
---
# How to release the components?

## Release phase

Release is automatized with [release-please](https://github.com/googleapis/release-please).
Merging the release Pull Request will perform the release:

* Generation of the CHANGELOG
* Bump of the version number in the package.json
* Commit and add git tag

## Publishing phase

Publishing the release is not done automatically.

You must get the fresh released code:

```sh
VERSION=${version} git fetch origin "$VERSION" && git checkout "$VERSION" && git reset --hard "$VERSION"
```

Publishing on npmjs.com (stable):

```sh
npm publish  --access public
```

Publishing on npmjs.com (beta):

```sh
npm publish  --access public --tag beta
```
