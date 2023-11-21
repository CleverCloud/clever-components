---
kind: '📌 Architecture Decision Records'
---

# ADR 0003: Why did we create a datetime relative component?

🗓️ 2019-10-16 · ✍️ Hubert Sablonnière

This ADR tries to explain why we created our own datetime relative component and how it compares to other solutions.

## Context?

In the `<cc-deployments>` components, we want to display a list of deployments and display the dates as "humanized time ago".

Before this was a component, when it was in the console codebase, we were using [moment.js](https://momentjs.com) to format this kind of dates.
See https://momentjs.com/docs/#/displaying/fromnow/.

## Problems?

* moment weights 17.31 KB (min+gzip) including en and fr locales.
* moment does not support tree shaking, so we have to load lots of code (and translations) we will never use just for this function.

## Considered solutions?

### Date libs

We looked for smaller "humanized time ago" librairies and tried those:

* https://date-fns.org/v2.4.1/docs/formatDistanceToNow
  * 👍 Tree shakable, around 3.4 KB (min+gzip) NOT including fr locale
  * 👎 The output is too long, especially in french (words like *about*, *less than*, *almost* are too much)
  * 👎 DOES NOT handle weeks
* https://github.com/catamphetamine/relative-time-format
  * 👍 Around 3.5 KB (min+gzip) NOT including fr locale
  * 👍 Highly configurable
  * 👎 Low level API, only accepts a unit and a value (you need `javascript-time-ago`)
* https://github.com/catamphetamine/javascript-time-ago
  * 👍 Around 3.6 KB (min+gzip) NOT including fr locale
  * 👍 Configurable
  * 👍 Handles weeks
* https://moment.github.io/luxon/
  * 👎 Does not have this feature
* https://github.com/iamkun/dayjs
  * 👎 Does not have this feature

### Web Components

GitHub open-sourced the Web Component they use to do that.
See https://github.com/github/time-elements.

* 👍 Around 2.7 KB (min+gzip) date formatting + Web Component
* 👍 Auto updates every minute
* 👍 Adds a title with a human date
* 👍 Based on `Intl.RelativeTimeFormat` (with fallback for Safari) 
* 👎 Not clear how they handle i18n when fallback is used
* 👎 The output rounding is weird

This was almost it but the 2 drawbacks pushed us to try something simpler.

### Standard

We mentioned it briefly in the previous section but their is a built-in standard in browsers to do this.
See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat.

* 👍 Native in Firefox & Chrome (https://caniuse.com/#feat=mdn-javascript_builtins_intl_relativetimeformat)
* 👎 Not supported in Safari 12+ (and we need that)
* 👎 Only handles unit and value, does not take care of selecting the right unit and rounding for a given time diff.

## Solution?

* We create our own component
  * Auto update behaviour like GitHub (but every 10 seconds)
  * Title attribute with human date like GitHub (using `Intl.DateTimeFormat`)
* Only handle past dates
* Use `Intl.RelativeTimeFormat`
* Dumb fallback for Safari 12+
* Our own system for i18n
* Less thank 1.5 KB (min+gzip)
  * Less than 500 bytes for the component with auto refresh
  * Less than 1 KB for the formatting (standard + dumb fallback) with "en" and "fr" locales
  
This way we have:

* Small size
* Short output
* Standard based when possible
* No weird rounding
* Weeks

## Differences between implementations

Here's some examples of the different outputs between the different impls (they were computed on Oct 16, 2019, 2:18 PM GMT+2):

### English

#### Now:

<table><tbody>
<tr><th>CC</th><td><span title="Oct 16, 2019, 2:18 PM GMT+2">just now</span></td></tr>
<tr><th>moment</th><td><span title="Oct 16, 2019, 2:18 PM GMT+2">a few seconds ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Oct 16, 2019, 2:18 PM GMT+2">less than 5 seconds ago</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 14:18 UTC+2">now</span></td></tr>
</tbody></table>

#### seconds ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="Oct 16, 2019, 2:18 PM GMT+2">1 second ago</span></td><td><span title="Oct 16, 2019, 2:18 PM GMT+2">5 seconds ago</span></td><td><span title="Oct 16, 2019, 2:18 PM GMT+2">10 seconds ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">20 seconds ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">30 seconds ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">45 seconds ago</span></td></tr>
<tr><th>moment</th><td><span title="Oct 16, 2019, 2:18 PM GMT+2">a few seconds ago</span></td><td><span title="Oct 16, 2019, 2:18 PM GMT+2">a few seconds ago</span></td><td><span title="Oct 16, 2019, 2:18 PM GMT+2">a few seconds ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">a few seconds ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">a few seconds ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">a minute ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Oct 16, 2019, 2:18 PM GMT+2">less than 5 seconds ago</span></td><td><span title="Oct 16, 2019, 2:18 PM GMT+2">less than 10 seconds ago</span></td><td><span title="Oct 16, 2019, 2:18 PM GMT+2">less than 20 seconds ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">half a minute ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">half a minute ago</span></td><td><span title="Oct 16, 2019, 2:17 PM GMT+2">less than a minute ago</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 14:18 UTC+2">now</span></td><td><span title="16 oct. 2019 à 14:18 UTC+2">now</span></td><td><span title="16 oct. 2019 à 14:18 UTC+2">10 seconds ago</span></td><td><span title="16 oct. 2019 à 14:17 UTC+2">20 seconds ago</span></td><td><span title="16 oct. 2019 à 14:17 UTC+2">30 seconds ago</span></td><td><span title="16 oct. 2019 à 14:17 UTC+2">1 minute ago</span></td></tr>
</tbody></table>

#### minutes ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="Oct 16, 2019, 2:17 PM GMT+2">1 minute ago</span></td><td><span title="Oct 16, 2019, 2:13 PM GMT+2">5 minutes ago</span></td><td><span title="Oct 16, 2019, 2:08 PM GMT+2">10 minutes ago</span></td><td><span title="Oct 16, 2019, 1:58 PM GMT+2">20 minutes ago</span></td><td><span title="Oct 16, 2019, 1:48 PM GMT+2">30 minutes ago</span></td><td><span title="Oct 16, 2019, 1:33 PM GMT+2">45 minutes ago</span></td></tr>
<tr><th>moment</th><td><span title="Oct 16, 2019, 2:17 PM GMT+2">a minute ago</span></td><td><span title="Oct 16, 2019, 2:13 PM GMT+2">5 minutes ago</span></td><td><span title="Oct 16, 2019, 2:08 PM GMT+2">10 minutes ago</span></td><td><span title="Oct 16, 2019, 1:58 PM GMT+2">20 minutes ago</span></td><td><span title="Oct 16, 2019, 1:48 PM GMT+2">30 minutes ago</span></td><td><span title="Oct 16, 2019, 1:33 PM GMT+2">an hour ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Oct 16, 2019, 2:17 PM GMT+2">1 minute ago</span></td><td><span title="Oct 16, 2019, 2:13 PM GMT+2">5 minutes ago</span></td><td><span title="Oct 16, 2019, 2:08 PM GMT+2">10 minutes ago</span></td><td><span title="Oct 16, 2019, 1:58 PM GMT+2">20 minutes ago</span></td><td><span title="Oct 16, 2019, 1:48 PM GMT+2">30 minutes ago</span></td><td><span title="Oct 16, 2019, 1:33 PM GMT+2">about 1 hour ago</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 14:17 UTC+2">1 minute ago</span></td><td><span title="16 oct. 2019 à 14:13 UTC+2">5 minutes ago</span></td><td><span title="16 oct. 2019 à 14:08 UTC+2">10 minutes ago</span></td><td><span title="16 oct. 2019 à 13:58 UTC+2">20 minutes ago</span></td><td><span title="16 oct. 2019 à 13:48 UTC+2">30 minutes ago</span></td><td><span title="16 oct. 2019 à 13:33 UTC+2">1 hour ago</span></td></tr>
</tbody></table>

#### hours ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="Oct 16, 2019, 1:18 PM GMT+2">1 hour ago</span></td><td><span title="Oct 16, 2019, 9:18 AM GMT+2">5 hours ago</span></td><td><span title="Oct 16, 2019, 4:18 AM GMT+2">10 hours ago</span></td><td><span title="Oct 15, 2019, 6:18 PM GMT+2">20 hours ago</span></td><td><span title="Oct 15, 2019, 8:18 AM GMT+2">yesterday</span></td><td><span title="Oct 14, 2019, 5:18 PM GMT+2">2 days ago</span></td></tr>
<tr><th>moment</th><td><span title="Oct 16, 2019, 1:18 PM GMT+2">an hour ago</span></td><td><span title="Oct 16, 2019, 9:18 AM GMT+2">5 hours ago</span></td><td><span title="Oct 16, 2019, 4:18 AM GMT+2">10 hours ago</span></td><td><span title="Oct 15, 2019, 6:18 PM GMT+2">20 hours ago</span></td><td><span title="Oct 15, 2019, 8:18 AM GMT+2">a day ago</span></td><td><span title="Oct 14, 2019, 5:18 PM GMT+2">2 days ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Oct 16, 2019, 1:18 PM GMT+2">about 1 hour ago</span></td><td><span title="Oct 16, 2019, 9:18 AM GMT+2">about 5 hours ago</span></td><td><span title="Oct 16, 2019, 4:18 AM GMT+2">about 10 hours ago</span></td><td><span title="Oct 15, 2019, 6:18 PM GMT+2">about 20 hours ago</span></td><td><span title="Oct 15, 2019, 8:18 AM GMT+2">1 day ago</span></td><td><span title="Oct 14, 2019, 5:18 PM GMT+2">2 days ago</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 13:18 UTC+2">1 hour ago</span></td><td><span title="16 oct. 2019 à 09:18 UTC+2">5 hours ago</span></td><td><span title="16 oct. 2019 à 04:18 UTC+2">10 hours ago</span></td><td><span title="15 oct. 2019 à 18:18 UTC+2">20 hours ago</span></td><td><span title="15 oct. 2019 à 08:18 UTC+2">yesterday</span></td><td><span title="14 oct. 2019 à 17:18 UTC+2">2 days ago</span></td></tr>
</tbody></table>

#### days ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="Oct 15, 2019, 2:18 PM GMT+2">yesterday</span></td><td><span title="Oct 11, 2019, 2:18 PM GMT+2">5 days ago</span></td><td><span title="Oct 6, 2019, 2:18 PM GMT+2">last week</span></td><td><span title="Sep 26, 2019, 2:18 PM GMT+2">3 weeks ago</span></td><td><span title="Sep 16, 2019, 2:18 PM GMT+2">4 weeks ago</span></td><td><span title="Sep 1, 2019, 2:18 PM GMT+2">last month</span></td></tr>
<tr><th>moment</th><td><span title="Oct 15, 2019, 2:18 PM GMT+2">a day ago</span></td><td><span title="Oct 11, 2019, 2:18 PM GMT+2">5 days ago</span></td><td><span title="Oct 6, 2019, 2:18 PM GMT+2">10 days ago</span></td><td><span title="Sep 26, 2019, 2:18 PM GMT+2">20 days ago</span></td><td><span title="Sep 16, 2019, 2:18 PM GMT+2">a month ago</span></td><td><span title="Sep 1, 2019, 2:18 PM GMT+2">a month ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Oct 15, 2019, 2:18 PM GMT+2">1 day ago</span></td><td><span title="Oct 11, 2019, 2:18 PM GMT+2">5 days ago</span></td><td><span title="Oct 6, 2019, 2:18 PM GMT+2">10 days ago</span></td><td><span title="Sep 26, 2019, 2:18 PM GMT+2">20 days ago</span></td><td><span title="Sep 16, 2019, 2:18 PM GMT+2">about 1 month ago</span></td><td><span title="Sep 1, 2019, 2:18 PM GMT+2">about 2 months ago</span></td></tr>
<tr><th>GitHub</th><td><span title="15 oct. 2019 à 14:18 UTC+2">yesterday</span></td><td><span title="11 oct. 2019 à 14:18 UTC+2">5 days ago</span></td><td><span title="6 oct. 2019 à 14:18 UTC+2">10 days ago</span></td><td><span title="26 sept. 2019 à 14:18 UTC+2">20 days ago</span></td><td><span title="16 sept. 2019 à 14:18 UTC+2">last month</span></td><td><span title="1 sept. 2019 à 14:18 UTC+2">2 months ago</span></td></tr>
</tbody></table>

#### weeks ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="Oct 9, 2019, 2:18 PM GMT+2">last week</span></td><td><span title="Sep 11, 2019, 2:18 PM GMT+2">last month</span></td><td><span title="Aug 7, 2019, 2:18 PM GMT+2">2 months ago</span></td><td><span title="May 29, 2019, 2:18 PM GMT+2">5 months ago</span></td><td><span title="Mar 20, 2019, 1:18 PM GMT+1">7 months ago</span></td><td><span title="Dec 5, 2018, 1:18 PM GMT+1">10 months ago</span></td></tr>
<tr><th>moment</th><td><span title="Oct 9, 2019, 2:18 PM GMT+2">7 days ago</span></td><td><span title="Sep 11, 2019, 2:18 PM GMT+2">a month ago</span></td><td><span title="Aug 7, 2019, 2:18 PM GMT+2">2 months ago</span></td><td><span title="May 29, 2019, 2:18 PM GMT+2">5 months ago</span></td><td><span title="Mar 20, 2019, 1:18 PM GMT+1">7 months ago</span></td><td><span title="Dec 5, 2018, 1:18 PM GMT+1">10 months ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Oct 9, 2019, 2:18 PM GMT+2">7 days ago</span></td><td><span title="Sep 11, 2019, 2:18 PM GMT+2">about 1 month ago</span></td><td><span title="Aug 7, 2019, 2:18 PM GMT+2">2 months ago</span></td><td><span title="May 29, 2019, 2:18 PM GMT+2">5 months ago</span></td><td><span title="Mar 20, 2019, 1:18 PM GMT+1">7 months ago</span></td><td><span title="Dec 5, 2018, 1:18 PM GMT+1">11 months ago</span></td></tr>
<tr><th>GitHub</th><td><span title="9 oct. 2019 à 14:18 UTC+2">7 days ago</span></td><td><span title="11 sept. 2019 à 14:18 UTC+2">last month</span></td><td><span title="7 août 2019 à 14:18 UTC+2">2 months ago</span></td><td><span title="29 mai 2019 à 14:18 UTC+2">5 months ago</span></td><td><span title="20 mars 2019 à 13:18 UTC+1">7 months ago</span></td><td><span title="5 déc. 2018 à 13:18 UTC+1">11 months ago</span></td></tr>
</tbody></table>

#### months ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="Sep 16, 2019, 3:48 AM GMT+2">last month</span></td><td><span title="May 17, 2019, 9:48 AM GMT+2">5 months ago</span></td><td><span title="Dec 16, 2018, 4:18 AM GMT+1">10 months ago</span></td><td><span title="Feb 14, 2018, 7:18 PM GMT+1">2 years ago</span></td><td><span title="Apr 16, 2017, 11:18 AM GMT+2">3 years ago</span></td><td><span title="Jan 15, 2016, 8:48 PM GMT+1">4 years ago</span></td></tr>
<tr><th>moment</th><td><span title="Sep 16, 2019, 3:48 AM GMT+2">a month ago</span></td><td><span title="May 17, 2019, 9:48 AM GMT+2">5 months ago</span></td><td><span title="Dec 16, 2018, 4:18 AM GMT+1">10 months ago</span></td><td><span title="Feb 14, 2018, 7:18 PM GMT+1">2 years ago</span></td><td><span title="Apr 16, 2017, 11:18 AM GMT+2">3 years ago</span></td><td><span title="Jan 15, 2016, 8:48 PM GMT+1">4 years ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Sep 16, 2019, 3:48 AM GMT+2">about 1 month ago</span></td><td><span title="May 17, 2019, 9:48 AM GMT+2">5 months ago</span></td><td><span title="Dec 16, 2018, 4:18 AM GMT+1">10 months ago</span></td><td><span title="Feb 14, 2018, 7:18 PM GMT+1">over 1 year ago</span></td><td><span title="Apr 16, 2017, 11:18 AM GMT+2">over 2 years ago</span></td><td><span title="Jan 15, 2016, 8:48 PM GMT+1">almost 4 years ago</span></td></tr>
<tr><th>GitHub</th><td><span title="16 sept. 2019 à 03:48 UTC+2">last month</span></td><td><span title="17 mai 2019 à 09:48 UTC+2">5 months ago</span></td><td><span title="16 déc. 2018 à 04:18 UTC+1">10 months ago</span></td><td><span title="14 févr. 2018 à 19:18 UTC+1">2 years ago</span></td><td><span title="16 avr. 2017 à 11:18 UTC+2">3 years ago</span></td><td><span title="15 janv. 2016 à 20:48 UTC+1">4 years ago</span></td></tr>
</tbody></table>

#### years ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="Oct 16, 2018, 8:18 AM GMT+2">last year</span></td><td><span title="Oct 16, 2014, 8:18 AM GMT+2">5 years ago</span></td><td><span title="Oct 16, 2009, 2:18 AM GMT+2">10 years ago</span></td><td><span title="Oct 16, 1999, 2:18 PM GMT+2">20 years ago</span></td><td><span title="Oct 16, 1989, 1:18 AM GMT+1">30 years ago</span></td><td><span title="Oct 16, 1974, 7:18 AM GMT+1">45 years ago</span></td></tr>
<tr><th>moment</th><td><span title="Oct 16, 2018, 8:18 AM GMT+2">a year ago</span></td><td><span title="Oct 16, 2014, 8:18 AM GMT+2">5 years ago</span></td><td><span title="Oct 16, 2009, 2:18 AM GMT+2">10 years ago</span></td><td><span title="Oct 16, 1999, 2:18 PM GMT+2">20 years ago</span></td><td><span title="Oct 16, 1989, 1:18 AM GMT+1">30 years ago</span></td><td><span title="Oct 16, 1974, 7:18 AM GMT+1">45 years ago</span></td></tr>
<tr><th>date-fns</th><td><span title="Oct 16, 2018, 8:18 AM GMT+2">about 1 year ago</span></td><td><span title="Oct 16, 2014, 8:18 AM GMT+2">about 5 years ago</span></td><td><span title="Oct 16, 2009, 2:18 AM GMT+2">about 10 years ago</span></td><td><span title="Oct 16, 1999, 2:18 PM GMT+2">about 20 years ago</span></td><td><span title="Oct 16, 1989, 1:18 AM GMT+1">about 30 years ago</span></td><td><span title="Oct 16, 1974, 7:18 AM GMT+1">about 45 years ago</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2018 à 08:18 UTC+2">last year</span></td><td><span title="16 oct. 2014 à 08:18 UTC+2">5 years ago</span></td><td><span title="16 oct. 2009 à 02:18 UTC+2">10 years ago</span></td><td><span title="16 oct. 1999 à 14:18 UTC+2">20 years ago</span></td><td><span title="16 oct. 1989 à 01:18 UTC+1">30 years ago</span></td><td><span title="16 oct. 1974 à 07:18 UTC+1">46 years ago</span></td></tr>
</tbody></table>

### French

#### Now:

<table><tbody>
<tr><th>CC</th><td><span title="16 oct. 2019 à 14:21 UTC+2">à l'instant</span></td></tr>
<tr><th>moment</th><td><span title="16 oct. 2019 à 14:21 UTC+2">il y a quelques secondes</span></td></tr>
<tr><th>date-fns</th><td><span title="16 oct. 2019 à 14:21 UTC+2">il y a moins de 5 secondes</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 14:21 UTC+2">maintenant</span></td></tr>
</tbody></table>

#### seconds ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 1 seconde</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 5 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 10 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 20 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 30 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 45 secondes</span></td></tr>
<tr><th>moment</th><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a quelques secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a quelques secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a quelques secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a quelques secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a quelques secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a une minute</span></td></tr>
<tr><th>date-fns</th><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a moins de 5 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a moins de 10 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a moins de 20 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 30 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 30 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a moins d’une minute</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 14:20 UTC+2">maintenant</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">maintenant</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 10 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 20 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 30 secondes</span></td><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 1 minute</span></td></tr>
</tbody></table>

#### minutes ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 1 minute</span></td><td><span title="16 oct. 2019 à 14:16 UTC+2">il y a 5 minutes</span></td><td><span title="16 oct. 2019 à 14:11 UTC+2">il y a 10 minutes</span></td><td><span title="16 oct. 2019 à 14:01 UTC+2">il y a 20 minutes</span></td><td><span title="16 oct. 2019 à 13:51 UTC+2">il y a 30 minutes</span></td><td><span title="16 oct. 2019 à 13:36 UTC+2">il y a 45 minutes</span></td></tr>
<tr><th>moment</th><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a une minute</span></td><td><span title="16 oct. 2019 à 14:16 UTC+2">il y a 5 minutes</span></td><td><span title="16 oct. 2019 à 14:11 UTC+2">il y a 10 minutes</span></td><td><span title="16 oct. 2019 à 14:01 UTC+2">il y a 20 minutes</span></td><td><span title="16 oct. 2019 à 13:51 UTC+2">il y a 30 minutes</span></td><td><span title="16 oct. 2019 à 13:36 UTC+2">il y a une heure</span></td></tr>
<tr><th>date-fns</th><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 1 minute</span></td><td><span title="16 oct. 2019 à 14:16 UTC+2">il y a 5 minutes</span></td><td><span title="16 oct. 2019 à 14:11 UTC+2">il y a 10 minutes</span></td><td><span title="16 oct. 2019 à 14:01 UTC+2">il y a 20 minutes</span></td><td><span title="16 oct. 2019 à 13:51 UTC+2">il y a 30 minutes</span></td><td><span title="16 oct. 2019 à 13:36 UTC+2">il y a environ 1 heure</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 14:20 UTC+2">il y a 1 minute</span></td><td><span title="16 oct. 2019 à 14:16 UTC+2">il y a 5 minutes</span></td><td><span title="16 oct. 2019 à 14:11 UTC+2">il y a 10 minutes</span></td><td><span title="16 oct. 2019 à 14:01 UTC+2">il y a 20 minutes</span></td><td><span title="16 oct. 2019 à 13:51 UTC+2">il y a 30 minutes</span></td><td><span title="16 oct. 2019 à 13:36 UTC+2">il y a 1 heure</span></td></tr>
</tbody></table>

#### hours ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="16 oct. 2019 à 13:21 UTC+2">il y a 1 heure</span></td><td><span title="16 oct. 2019 à 09:21 UTC+2">il y a 5 heures</span></td><td><span title="16 oct. 2019 à 04:21 UTC+2">il y a 10 heures</span></td><td><span title="15 oct. 2019 à 18:21 UTC+2">il y a 20 heures</span></td><td><span title="15 oct. 2019 à 08:21 UTC+2">hier</span></td><td><span title="14 oct. 2019 à 17:21 UTC+2">avant-hier</span></td></tr>
<tr><th>moment</th><td><span title="16 oct. 2019 à 13:21 UTC+2">il y a une heure</span></td><td><span title="16 oct. 2019 à 09:21 UTC+2">il y a 5 heures</span></td><td><span title="16 oct. 2019 à 04:21 UTC+2">il y a 10 heures</span></td><td><span title="15 oct. 2019 à 18:21 UTC+2">il y a 20 heures</span></td><td><span title="15 oct. 2019 à 08:21 UTC+2">il y a un jour</span></td><td><span title="14 oct. 2019 à 17:21 UTC+2">il y a 2 jours</span></td></tr>
<tr><th>date-fns</th><td><span title="16 oct. 2019 à 13:21 UTC+2">il y a environ 1 heure</span></td><td><span title="16 oct. 2019 à 09:21 UTC+2">il y a environ 5 heures</span></td><td><span title="16 oct. 2019 à 04:21 UTC+2">il y a environ 10 heures</span></td><td><span title="15 oct. 2019 à 18:21 UTC+2">il y a environ 20 heures</span></td><td><span title="15 oct. 2019 à 08:21 UTC+2">il y a 1 jour</span></td><td><span title="14 oct. 2019 à 17:21 UTC+2">il y a 2 jours</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2019 à 13:21 UTC+2">il y a 1 heure</span></td><td><span title="16 oct. 2019 à 09:21 UTC+2">il y a 5 heures</span></td><td><span title="16 oct. 2019 à 04:21 UTC+2">il y a 10 heures</span></td><td><span title="15 oct. 2019 à 18:21 UTC+2">il y a 20 heures</span></td><td><span title="15 oct. 2019 à 08:21 UTC+2">hier</span></td><td><span title="14 oct. 2019 à 17:21 UTC+2">avant-hier</span></td></tr>
</tbody></table>

#### days ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="15 oct. 2019 à 14:21 UTC+2">hier</span></td><td><span title="11 oct. 2019 à 14:21 UTC+2">il y a 5 jours</span></td><td><span title="6 oct. 2019 à 14:21 UTC+2">la semaine dernière</span></td><td><span title="26 sept. 2019 à 14:21 UTC+2">il y a 3 semaines</span></td><td><span title="16 sept. 2019 à 14:21 UTC+2">il y a 4 semaines</span></td><td><span title="1 sept. 2019 à 14:21 UTC+2">le mois dernier</span></td></tr>
<tr><th>moment</th><td><span title="15 oct. 2019 à 14:21 UTC+2">il y a un jour</span></td><td><span title="11 oct. 2019 à 14:21 UTC+2">il y a 5 jours</span></td><td><span title="6 oct. 2019 à 14:21 UTC+2">il y a 10 jours</span></td><td><span title="26 sept. 2019 à 14:21 UTC+2">il y a 20 jours</span></td><td><span title="16 sept. 2019 à 14:21 UTC+2">il y a un mois</span></td><td><span title="1 sept. 2019 à 14:21 UTC+2">il y a un mois</span></td></tr>
<tr><th>date-fns</th><td><span title="15 oct. 2019 à 14:21 UTC+2">il y a 1 jour</span></td><td><span title="11 oct. 2019 à 14:21 UTC+2">il y a 5 jours</span></td><td><span title="6 oct. 2019 à 14:21 UTC+2">il y a 10 jours</span></td><td><span title="26 sept. 2019 à 14:21 UTC+2">il y a 20 jours</span></td><td><span title="16 sept. 2019 à 14:21 UTC+2">il y a environ 1 mois</span></td><td><span title="1 sept. 2019 à 14:21 UTC+2">il y a environ 2 mois</span></td></tr>
<tr><th>GitHub</th><td><span title="15 oct. 2019 à 14:21 UTC+2">hier</span></td><td><span title="11 oct. 2019 à 14:21 UTC+2">il y a 5 jours</span></td><td><span title="6 oct. 2019 à 14:21 UTC+2">il y a 10 jours</span></td><td><span title="26 sept. 2019 à 14:21 UTC+2">il y a 20 jours</span></td><td><span title="16 sept. 2019 à 14:21 UTC+2">le mois dernier</span></td><td><span title="1 sept. 2019 à 14:21 UTC+2">il y a 2 mois</span></td></tr>
</tbody></table>

#### weeks ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="9 oct. 2019 à 14:21 UTC+2">la semaine dernière</span></td><td><span title="11 sept. 2019 à 14:21 UTC+2">le mois dernier</span></td><td><span title="7 août 2019 à 14:21 UTC+2">il y a 2 mois</span></td><td><span title="29 mai 2019 à 14:21 UTC+2">il y a 5 mois</span></td><td><span title="20 mars 2019 à 13:21 UTC+1">il y a 7 mois</span></td><td><span title="5 déc. 2018 à 13:21 UTC+1">il y a 10 mois</span></td></tr>
<tr><th>moment</th><td><span title="9 oct. 2019 à 14:21 UTC+2">il y a 7 jours</span></td><td><span title="11 sept. 2019 à 14:21 UTC+2">il y a un mois</span></td><td><span title="7 août 2019 à 14:21 UTC+2">il y a 2 mois</span></td><td><span title="29 mai 2019 à 14:21 UTC+2">il y a 5 mois</span></td><td><span title="20 mars 2019 à 13:21 UTC+1">il y a 7 mois</span></td><td><span title="5 déc. 2018 à 13:21 UTC+1">il y a 10 mois</span></td></tr>
<tr><th>date-fns</th><td><span title="9 oct. 2019 à 14:21 UTC+2">il y a 7 jours</span></td><td><span title="11 sept. 2019 à 14:21 UTC+2">il y a environ 1 mois</span></td><td><span title="7 août 2019 à 14:21 UTC+2">il y a 2 mois</span></td><td><span title="29 mai 2019 à 14:21 UTC+2">il y a 5 mois</span></td><td><span title="20 mars 2019 à 13:21 UTC+1">il y a 7 mois</span></td><td><span title="5 déc. 2018 à 13:21 UTC+1">il y a 11 mois</span></td></tr>
<tr><th>GitHub</th><td><span title="9 oct. 2019 à 14:21 UTC+2">il y a 7 jours</span></td><td><span title="11 sept. 2019 à 14:21 UTC+2">le mois dernier</span></td><td><span title="7 août 2019 à 14:21 UTC+2">il y a 2 mois</span></td><td><span title="29 mai 2019 à 14:21 UTC+2">il y a 5 mois</span></td><td><span title="20 mars 2019 à 13:21 UTC+1">il y a 7 mois</span></td><td><span title="5 déc. 2018 à 13:21 UTC+1">il y a 11 mois</span></td></tr>
</tbody></table>

#### months ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="16 sept. 2019 à 03:51 UTC+2">le mois dernier</span></td><td><span title="17 mai 2019 à 09:51 UTC+2">il y a 5 mois</span></td><td><span title="16 déc. 2018 à 04:21 UTC+1">il y a 10 mois</span></td><td><span title="14 févr. 2018 à 19:21 UTC+1">il y a 2 ans</span></td><td><span title="16 avr. 2017 à 11:21 UTC+2">il y a 3 ans</span></td><td><span title="15 janv. 2016 à 20:51 UTC+1">il y a 4 ans</span></td></tr>
<tr><th>moment</th><td><span title="16 sept. 2019 à 03:51 UTC+2">il y a un mois</span></td><td><span title="17 mai 2019 à 09:51 UTC+2">il y a 5 mois</span></td><td><span title="16 déc. 2018 à 04:21 UTC+1">il y a 10 mois</span></td><td><span title="14 févr. 2018 à 19:21 UTC+1">il y a 2 ans</span></td><td><span title="16 avr. 2017 à 11:21 UTC+2">il y a 3 ans</span></td><td><span title="15 janv. 2016 à 20:51 UTC+1">il y a 4 ans</span></td></tr>
<tr><th>date-fns</th><td><span title="16 sept. 2019 à 03:51 UTC+2">il y a environ 1 mois</span></td><td><span title="17 mai 2019 à 09:51 UTC+2">il y a 5 mois</span></td><td><span title="16 déc. 2018 à 04:21 UTC+1">il y a 10 mois</span></td><td><span title="14 févr. 2018 à 19:21 UTC+1">il y a plus d’un an</span></td><td><span title="16 avr. 2017 à 11:21 UTC+2">il y a plus de 2 ans</span></td><td><span title="15 janv. 2016 à 20:51 UTC+1">il y a presque 4 ans</span></td></tr>
<tr><th>GitHub</th><td><span title="16 sept. 2019 à 03:51 UTC+2">le mois dernier</span></td><td><span title="17 mai 2019 à 09:51 UTC+2">il y a 5 mois</span></td><td><span title="16 déc. 2018 à 04:21 UTC+1">il y a 10 mois</span></td><td><span title="14 févr. 2018 à 19:21 UTC+1">il y a 2 ans</span></td><td><span title="16 avr. 2017 à 11:21 UTC+2">il y a 3 ans</span></td><td><span title="15 janv. 2016 à 20:51 UTC+1">il y a 4 ans</span></td></tr>
</tbody></table>

#### years ago (1, 5, 10, 20, 30, 45):

<table><tbody>
<tr><th>CC</th><td><span title="16 oct. 2018 à 08:21 UTC+2">l’année dernière</span></td><td><span title="16 oct. 2014 à 08:21 UTC+2">il y a 5 ans</span></td><td><span title="16 oct. 2009 à 02:21 UTC+2">il y a 10 ans</span></td><td><span title="16 oct. 1999 à 14:21 UTC+2">il y a 20 ans</span></td><td><span title="16 oct. 1989 à 01:21 UTC+1">il y a 30 ans</span></td><td><span title="16 oct. 1974 à 07:21 UTC+1">il y a 45 ans</span></td></tr>
<tr><th>moment</th><td><span title="16 oct. 2018 à 08:21 UTC+2">il y a un an</span></td><td><span title="16 oct. 2014 à 08:21 UTC+2">il y a 5 ans</span></td><td><span title="16 oct. 2009 à 02:21 UTC+2">il y a 10 ans</span></td><td><span title="16 oct. 1999 à 14:21 UTC+2">il y a 20 ans</span></td><td><span title="16 oct. 1989 à 01:21 UTC+1">il y a 30 ans</span></td><td><span title="16 oct. 1974 à 07:21 UTC+1">il y a 45 ans</span></td></tr>
<tr><th>date-fns</th><td><span title="16 oct. 2018 à 08:21 UTC+2">il y a environ 1 an</span></td><td><span title="16 oct. 2014 à 08:21 UTC+2">il y a environ 5 ans</span></td><td><span title="16 oct. 2009 à 02:21 UTC+2">il y a environ 10 ans</span></td><td><span title="16 oct. 1999 à 14:21 UTC+2">il y a environ 20 ans</span></td><td><span title="16 oct. 1989 à 01:21 UTC+1">il y a environ 30 ans</span></td><td><span title="16 oct. 1974 à 07:21 UTC+1">il y a environ 45 ans</span></td></tr>
<tr><th>GitHub</th><td><span title="16 oct. 2018 à 08:21 UTC+2">l’année dernière</span></td><td><span title="16 oct. 2014 à 08:21 UTC+2">il y a 5 ans</span></td><td><span title="16 oct. 2009 à 02:21 UTC+2">il y a 10 ans</span></td><td><span title="16 oct. 1999 à 14:21 UTC+2">il y a 20 ans</span></td><td><span title="16 oct. 1989 à 01:21 UTC+1">il y a 30 ans</span></td><td><span title="16 oct. 1974 à 07:21 UTC+1">il y a 46 ans</span></td></tr>
</tbody></table>
