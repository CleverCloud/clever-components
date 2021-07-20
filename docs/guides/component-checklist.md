---
kind: '📌 Docs'
---
# Component Checklist

The purpose of this document is to allow you to check your component when you think it's done before further reviews.

Before, going any further into the checklist we suppose that you have read and applied [the guideline](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%93%8C-docs-web-components-guidelines-at-clever-cloud--page).

# Preliminary check

Fist, please run : `npm run lint`

It will allow you to check manually if you have linter errors for your component or story.

You can then run if you have errors: `npm run lint:fix` to fix some of them automatically. 

Then, please run these two commands :
* `npm run components:check-lit`
* `npm run components:check-i18n`

It will allow you to check if Lit or if you have missed something while making the component.

(e.g: an import of a component that you use in the one you're making)

It will also allow you to check if you have problems with your translations. (e.g: a translation missing)

# Checklist

## Component documentation 

## Component

## Global

* Check if you have remaining `console.log()` and delete them.
* If you use classMap please put the classMap at then end of your classes.
* If you use other components in the one you're making, and you have to deal with event put them at the end
  where ths props are initiated.

## Component documentation

* All props are listed.
* Props have a description.
* Interfaces are detailed (when needed).
* Props have their interfaces associated (when needed).

## Properties 
* Sort the properties : 
    * The public ones first
    * The private ones after
* Make sure you have set their default values when needed.    

## Methods

* Check that they are placed and sorted within the guideline requirements.

## Render 

## Stories
