---
kind: '📌 Architecture Decision Records'
---

# ADR 0013: Replace GitLab CI + Clever app with simple object storage hosting for previews

🗓️ 2021-04-20 · ✍️ Hubert Sablonnière

## The context

We used to have a GitLab CI integration to publish previews of the Storybook for any given branch.

Each time a branch was pushed, a GitLab runner was invoked with the build described in `.gitlab-ci.yml`:

* Create a Node.js app on Clever (or link existing one)
* Configure the app (scalability, env vars, domain...)
* Deploy the branch

On top of waiting for the GitLab runner to kick in, the whole build was rather long:

* Fetch all the dependencies
* Build the static Storybook

With this GitLab CI + Clever Node.js app system, the time between a push and a live preview was around 7 to 8 minutes.
In the context of showing live previews of components and sometimes with multiple iterations/ideas for the same branch, it's way too long and cumbersome.

## The solution

* Build locally
  * The developer who needs to publish a preview already has the dependencies
  * The developer probably has a faster machine that the one that will run the static Storybook build
    * It takes 50 seconds on my machine
* Publish to Cellar, Clever Cloud's S3 compatible object storage
  * We will lack good HTTP compression and cache settings but it's OK
  * It's fast! It's just a matter of uploading static files
    * It takes around 5 secs on my machine
* Add some helper scripts to:
  * List currently uploaded previews
  * Publish or update a preview, with the ability to override the name
  * Delete a preview

The whole thing takes a bit less than 1 minute.

### Bonus points

* Ability to publish multiple previews from the same branch
* Ability to publish a preview even when we use a local version of a dependency (like the clever-client)

### Remarks

The code with the scripts/commands is a all-in-one file with everything, lots of shell exec... 
There is a lot of room to improve this.
Consider this system a work in progress.
