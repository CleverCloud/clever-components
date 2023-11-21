---
kind: '📌 Architecture Decision Records'
---

# ADR 0011: Sorting CSS declarations

🗓️ 2020-05-02 · ✍️ Hubert Sablonnière

Since we started this project, we tried to apply an alphabetical sort on CSS declarations inside our LitElement based components.
We did it manually and of course we failed in some places, so it's time to automate this...

## Why would we want to sort declaration?

There are several reasons we want to sort CSS declarations alphabetically:

* Consistency, only one place to add a new declaration.
* It may sometimes help to trigger conflicts if both branches add a declaration with the same property and a different value.
* Easy to find a property when you read code.

Cons:

* Some linked properties can sometimes be far from each other:
  * like `position` with `top`, `right`, `bottom` and `left`
  * like `display:flex` or `display:grid` with `justify-contents` or `align-items`

## How do we extract CSS from JavaScript file using LitElement?

### The babel failure

Our first attempt was to use [babel](https://babeljs.io/).
Here's the process we tried:

1. Load source files.
2. Use babel programmatically to parse our JavaScript files to an AST.
3. Walk the AST and look for the tagged template expression with LitElement's `css` tag function.
4. Appling a sort on the CSS string and modify the AST.
5. Ask babel to stringify the modified AST.
6. Write back the new formatted JavaScript into the source file.

PROBLEM: Babel's AST transformation does not capture enough information to reproduce the exact same code formatting.
So the result of this process was: sorted CSS just like we wanted + small annoying style modification on the JavaScript parts.

### The ESLint success

Our second attempt was to use [eslint](https://eslint.org/).
We considered ESLint because it has a "fix" feature for a lot of rules and by experience, we know it keeps the parts it does not fix untouched.

With ESLint, there was no need to use the lib programmatically:

* We created a custom rule at `eslint-rules/sort-lit-element-css-declarations.js`.
* We added configured the `--rulesdir eslint-rules` in our `package.json` lint scripts.
* We enabled the rule in our config at `.eslintrc.js`.

Here's the process we tried in our rule:

1. Match `TaggedTemplateExpression` AST nodes.
  * ESLint makes this really easy.
2. Check they are tagged with LitElement's `css` tag function.
3. Retrieve raw string containing CSS
  * NOTE: We only support param less situations for now.
4. Appling a sort on the CSS string and modify the AST.
5. Compare before and after sort and report error if it's different.
  * ESLint is designed to look for errors and report them, so it's was a perfect fit.
6. Provide a fix method to replace the badly sorted CSS with the good one.
  * ESLint's fix feature applies targeted and smart text replacement on the source. That's how it's able to keep the rest as is.

## How do we sort CSS declarations?

The first intuition was to use [PostCSS](https://postcss.org/), a very powerful CSS parser/transformer tool.

### The `css-declaration-sorter` failure

The first plugin we tried to apply the CSS declaration sort was [Siilwyn/css-declaration-sorter](https://github.com/Siilwyn/css-declaration-sorter).

The plugin works great but it is asynchronous and it seems like ESLint does not allow anyone to write asynchronous code in fixes.
PostCSS pushes plugin devs to write async plugins and it's probably a good practice but in our case it's a deal breaker.

After a few research, we discovered that as long as all plugins in the chain are synchronous, PostCSS can be used synchronously. 
We also discovered why `css-declaration-sorter` is async.
It provides a config to chose the sort order (alphabetical, smacss...) and to apply this sort order, it asynchronously loads a JSON file.
We also discovered that if you provide your own sort order function, the plugin is sync, yeah!!

We managed to require the inner JSON file for alpha sort order and provide a function to use the plugin synchronously.

This seemed a bit hacky and we had a few problems with unknown properties like `grid-gap`.

### The `postcss-sorting` success

The second plugin we tried to apply the CSS declaration sort was [hudochenkov/postcss-sorting](https://github.com/hudochenkov/postcss-sorting).

* Plugin is easy to configure
* Plugin works synchronously

EPIC SUCCESS!

## Links

The whole motivation to tackle this was triggerd by this article from Pascal Schilp: [Babel, Beyond Assumptions (medium.com/ing-blog)](https://medium.com/ing-blog/babel-beyond-assumptions-cf04b2dc1006).

We also did a bit of research first to find the existing tooling for lit and CSS:

* https://github.com/web-padawan/awesome-lit-html
* https://github.com/umbopepato/rollup-plugin-postcss-lit
* https://github.com/egoist/rollup-plugin-postcss
* https://github.com/bennypowers/rollup-plugin-lit-css
* https://github.com/cfware/babel-plugin-template-html-minifier

About ESLint, we used the docs, looked at the source of many existing rules and the awesome ASTExplorer helped a lot:

* https://eslint.org/docs/developer-guide/working-with-rules
* https://github.com/eslint/eslint/blob/master/lib/rules/arrow-parens.js
* https://github.com/dustinspecker/awesome-eslint
* https://astexplorer.net/

## Questions

Now that we have a hook into our components' CSS, can we add other checks?

* Should we run [Prettier](https://prettier.io/) ?
* Should we run [stylelint](https://stylelint.io/) ?
