---
kind: '📌 Docs'
---
# Component Checklist

The purpose of this document is to allow you to check your component when you think it's done before further reviews.

Before, going any further into the checklist we suppose that you have read and applied [the guideline](https://www.clever-cloud.com/doc/clever-components/?path=/docs/%F0%9F%93%8C-docs-web-components-guidelines-at-clever-cloud--page).


# Preliminary check

First, please run these two commands :
* `npm run components:check-lit`
* `npm run components:check-i18n`

It will allow you to check if Lit or if you have missed something while making the component.

(e.g: an import of a component that you use in the one you're making)

It will also allow you to check if you have problems with your translations. (e.g: a translation missing)

# Checklist

## Component documentation 

## Component

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

## Global

* Check if you have remaining `console.log()` and delete them


## Stories
