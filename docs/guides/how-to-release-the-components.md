---
kind: 📌 Docs
---
# How to release the components?

Here's the guide to create a new release:

1. Make sure you updated the `CHANGELOG.md` with all the new features and bugfixes.
1. Decide if you're doing a `major`, `minor` or `patch` version or even a `prerelease` according to the semver spec.
1. Make sure the commit you want to version is on `master`.
1. Run the `npm version` command with the right parameters (see details below).
  * This will update `package.json` and `package-lock.json` in a new commit.
  * This will create a git tag.
1. Push the updated `master` branch with the new tag on GitHub (see details below).
1. Run `npm publish` to deploy the new version on npmjs.com (see details below).

`npm version` for a stable version:

```sh
# For a major version, ex: 1.2.3 => 2.0.0
npm version major
# For a minor version, ex: 1.2.3 => 1.3.0
npm version minor
# For a patch version, ex: 1.2.3 => 1.2.4
npm version patch
```

`npm version` for a beta version:

```sh
# For a premajor version, ex: 1.2.3 => 2.0.0-beta.1
npm version premajor
# For a preminor version, ex: 1.2.3 => 1.3.0-beta.1 
npm version preminor
# For a prepatch version, ex: 1.2.3 => 1.2.4-beta.1
npm version prepatch
# For a pre release, ex: 1.2.3-beta.1 => 1.2.3-beta.2
npm version prerelease
```

Pushing new master and new tag:

```sh
git push origin master --tags
```

Publishing on npmjs.com (stable):

```sh
npm publish  --access public
```

Publishing on npmjs.com (beta):

```sh
npm publish  --access public --tag beta
```
