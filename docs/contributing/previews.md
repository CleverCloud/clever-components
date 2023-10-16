---
kind: '👋 Contributing'
title: 'Previews'
---

# How to publish previews

When working on this component library, we often need to publish and share a live preview of the components to get some feedbacks.
In order to do this, we have a series of scripts to quickly publish a preview.

We provide two sorts of outputs:

* a Storybook with all our components and stories
* files to be served by our smart CDN

For both outputs, we provide a way to publish a preview.

## Storybook previews

_**WARNINGS:**_ All the following commands require 2 environment variables to access the Cellar `addon_9feadcac-4278-4af1-bfea-597477bf9b92`.

* `PREVIEWS_CELLAR_KEY_ID`: the S3 `access_key`
* `PREVIEWS_CELLAR_SECRET_KEY`: the S3 `secret_key`

We advise you to put those into a `.env` file, so you can source it once and use all commands:

```
export PREVIEWS_CELLAR_KEY_ID=XXXXXXXXXXXXXXXXXXXX;
export PREVIEWS_CELLAR_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX;
```

### List previews

You can list the currently published previews with:

```
npm run preview:list
```

You can also browse this page:

https://clever-components-preview.cellar-c2.services.clever-cloud.com/index.html

### Publish/update a preview

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

### Delete a preview

When you're done with a preview, you can delete it with:

```
npm run preview:delete preview-name
```

## CDN previews

_**WARNINGS:**_ All the following commands require 2 environment variables to access the Cellar `addon_a80c7b16-20ce-4387-a5f9-34095ed15c7f`.

* `SMART_CDN_PREVIEW_CELLAR_KEY_ID`: the S3 `access_key`
* `SMART_CDN_PREVIEW_CELLAR_SECRET_KEY`: the S3 `secret_key`

We advise you to put those into a `.env` file, so you can source it once and use all commands:

```
export SMART_CDN_PREVIEW_CELLAR_KEY_ID=XXXXXXXXXXXXXXXXXXXX;
export SMART_CDN_PREVIEW_CELLAR_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX;
```

### Get preview detail

You can get a published preview details with:

```
npm run cdn-preview:get preview-name
```

The preview name argument can be omitted if you want to get details of the preview corresponding to the current branch.

### List preview

You can list the currently published previews with:

```
npm run cdn-preview:list
```

You can also browse this page:

https://preview-components.clever-cloud.com/list.html

### Publish/update a preview

When you're working on a branch, and you want to publish a preview, you'll need to build the CDN first:

```
npm run cdn-preview:build
```

Once the build is ready, you can publish a preview with:

```
npm run cdn-preview:publish
```

* By default, the preview will be named like your current branch.
* If there's already a published preview with this name, it will be replaced.

You can publish a preview with a different name.
First, you need to build it with:

```
PREVIEW=feature-x-blue npm run cdn-preview:build
```

Then, you publish it with:

```
npm run cdn-preview:publish feature-x-blue
```

This is often required when you work on a branch, but you want to share multiple iterations/ideas of a given feature.

### Delete a preview

When you're done with a preview, you can delete it with:

```
npm run cdn-preview:delete preview-name
```
