---
kind: 📌 Docs
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

Publishing the release is not done automatically.

You must get the fresh released code:

```sh
VERSION=${version} && git fetch --tags origin "$VERSION" && git checkout "$VERSION" && git reset --hard "$VERSION"
```

Publishing on npmjs.com (stable):

```sh
npm publish  --access public
```

Publishing on npmjs.com (beta):

```sh
npm publish  --access public --tag beta
```
