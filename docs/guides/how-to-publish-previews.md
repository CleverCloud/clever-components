---
kind: 📌 Docs
---
# How to publish previews

When working on this components library, we often need to publish and share a live preview of the components to get some feedbacks.
In order to do this, we have a series of scripts to quickly publish a preview.

_**WARNINGS:**_ All the following commands require 2 environment variables to access the Cellar `addon_9feadcac-4278-4af1-bfea-597477bf9b92`.

* `PREVIEWS_CELLAR_KEY_ID`: the S3 `access_key`
* `PREVIEWS_CELLAR_SECRET_KEY`: the S3 `secret_key`

We advise you to put those into a `.env` file, so you can source it once and use all commands:

```
export PREVIEWS_CELLAR_KEY_ID=XXXXXXXXXXXXXXXXXXXX;
export PREVIEWS_CELLAR_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX;
```

## List previews

You can list the currently published previews with:

```
npm run preview:list
```

You can also browse this page:

https://clever-components-preview.cellar-c2.services.clever-cloud.com/index.html

## Publish/update a preview

When you're working on a branch, and you want to publish a preview, you'll need to build the static Storybook first:

```
npm run storybook:build
```

Once the build is ready, you can publish a preview with:

```
npm run preview:publish
```

* By the default, the preview will be named like your current branch.
* If there's already a published preview with this name, it will be replaced.

You can publish a preview with a different name with:

```
npm run preview:publish feature-x-blue
```

This is often required when you work on a branch but you want to share multiple iterations/ideas of a given feature.

## Delete a preview

When you're done with a preview, you can delete it with:

```
npm run preview:delete preview-name
```
