---
kind: '📌 Architecture Decision Records'
---

# ADR 0021: Switching from rem to em units

🗓️ 2022-08-29 · ✍️ Florian Sanders

## The context

Since the beginning of this component library, we've been using relative units for almost everything in our CSS.

### Using relative units for font size

Users can set their base font size through the Operating System settings and the browser settings as well.
However, this setting may be completely ignored by some browsers when the website font sizes have been set using fixed units like `px`. 
This is the case with Chrome for instance, where font sizes in `px` remain the same whatever base font size you select in the settings.

Users can still Zoom, but they would have to do it on every single website they are viewing.
Usually, when people truly need bigger characters, they want to specify the size once for instance from the Operating System settings. They expect it to be applied everywhere, including the browser interface and every website they visit.

### Using relative units for everything else

Using relative font sizes is not enough because when the text gets bigger, containers should also get bigger.
If not, then the text will overflow and may become unreadable.

This is why we also used relative units for every size (`padding`, `margin`, `border`, etc.).

We introduced a few exceptions for some `border` and `box-shadow` styles when it did not make sense to make them scale with the font size.

### Choosing the relative unit

There are several [relative units in CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#relative_length_units) but in most cases it comes down to two options:

* `em` which is based on the font size of the parent for typographical properties (`font-size` for instance) and the element itself for other properties (`width`, `height`, etc.).
* `rem` which is based on the font size set on the root element (the `<html>` tag).

We chose to use the `rem` unit because it felt like it was the simplest to use.
It allowed us to use a unit that we assumed would always be computed to the same value across all our components.

## The problem

While trying to use our components, we faced issues with two of our websites that modify the root font size used by the `rem` unit.

In our private admin dashboard, the root font size is specified like this:

```css
html {
  font-size: 62.5%;
}
```

It's not bad practice as it still respects the user's settings but it may completely break any third party CSS based on `rem`.

In our documentation website, the root font size is specified like this:

```css
html {
  font-size: 10px;
}
```

This is clearly bad practice as it may completely ignore the user's settings.
Sadly, this practice is not that uncommon on the Web.

In both cases, the goal is generally to simplify the conversion from `px` to `rem`.
This way, developers only have to divide the size in pixels by 10 to get the corresponding `rem` size as explained in [The Surprising Truth about Pixels and Accessibility by Josh W Comeau](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/#the-625-trick).

For instance, `16px` equals to `1.6rem`.

The issue is that our components were built assuming that `1rem` would be either equal to `16px` or a value set by the user.
In these two situations, `1rem` is equal to `10px` so our components looked a lot smaller on these two websites.

One of the key principles of our Web Components is that they can be used in almost any context.
Using `rem` units clearly fails this principle because they rely on a root font size they cannot control.

## The solution

We decided to change `rem` units to `em`.

This way, our components depend on the font size inherited from their parent instead of the root.

We know this solution is a little less easy to use for us since we have to make calculations everytime part of a component sets a different font size.
Fortunately, these cases are fairly rare.

The switch between the two units was done manually, and we chose to round the values as much as possible.
This means the switch was not pixel perfect but in most cases, the pixels difference between the values computed from `rem` and `em` were insignificant.

## The limits

However, this solution is not perfect.
It kind of clashes with some of the [design tokens we plan to introduce later on](https://github.com/CleverCloud/clever-components/issues/398).

For some of them, like `padding`, `margin`, `line-height`, it could make sense that the size would depend on the font size.
The bigger the font size, the more space you would need, and the opposite would also be true.

For others, like `font-size`, `border-radius`, `box-shadow`, we wanted to introduce tokens with values that would be the same across all our components.

For instance:
```css
--cc-font-size-xs: 0.9em;
```

The `em` unit defeats the goal of this kind of design tokens since its value will not be the same across all our components, depending on whether another `font-size` has been set on the element or its parent.

## The wish list

The ideal solution would be a relative unit which computed value would remain the same between all of our Web Components. The base value could be overridden from our theme for instance.

Reading through this [cancelled proposal for a 'hem' CSS unit relative to the host element font size](https://github.com/w3c/csswg-drafts/issues/7613) and the [proposal for CSS Custom Units](https://github.com/w3c/csswg-drafts/issues/7379), it seems like custom units could be a better fit for our context than `em` but this is clearly long term planning as it is still being discussed.

We will continue to follow the progress on this subject.

## Resources

### In English:

* [The Surprising Truth about Pixels and Accessibility by Josh W Comeau](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/#the-625-trick),
* [People don't change the default 16px font size in their browser (You wish!), by Nicolas Hoizey](https://nicolas-hoizey.com/articles/2016/03/02/people-don-t-change-the-default-16px-font-size-in-their-browser/).

### In French:

* <a href="https://www.lalutineduweb.fr/accessibilite-personne-ne-le-fait/" lang="fr">Accessibilité : personne ne le fait donc on s’en fiche, par Julie Moynat</a>,
* <a href="https://nicolas-hoizey.com/talks/2013/10/10/un-petit-pas-pour-l-em-un-grand-pas-pour-le-web/" lang="fr">Un petit pas pour l’em, un grand pas pour le Web, par Nicolas Hoizey</a>,
* <a href="https://code-garage.fr/blog/css-px-em-ou-rem-pour-dimensionner-ses-textes/" lang="fr">Faut-il utiliser px, em ou rem pour dimensionner ses textes en CSS ?, par Nicolas Brondin-Bernard</a>.
