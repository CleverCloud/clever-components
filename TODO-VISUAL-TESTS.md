# PR #1

- [x] delete all component test files
- [x] create plugin to run tests on stories
- [x] move accessibility tests in test-stories helper
- [x] add groups

# PR #2

- [ ] add ignores for stories that fail (fix those that we can), list the stories that fail by putting the test output into a file
- [x] add plugin to run visual tests
- [x] add visual regression tests in test-stories helper
- [x] add `update-visuals` command to npm scripts
- [x] add cellar support to visual tests
  - [x] when getting baseline, first try to get it from currentBranch
    - [x] if gotten from currentBranch, then means that we have visual changes (new baseline)
    - [x] if nothing from currentBranch, fetch from master (no new baseline => master baseline)
  - [x] saving diff always to currentBranch
    - [ ] in case diff is weird, should we save it locally so you can check?
    - [ ] maybe we should always save locally (except in CI) but gitignore it
  - [x] saving new baseline (specific command / flag) => always to currentBranch
- [ ] secu: when running locally, you need to have access to the cellar
  - [ ] maybe we could add some way to trigger the update from a github PR? (for people who don't have the credentials) (hmm anyway GH action shouldn't run if people are not repo members)
  - [ ] we could also fallback to local (gitignored) when no cellar credentials have been provided?
- [ ] need a way to remove all for current branch (a task)

GITHUB ACTIONS:
- [ ] when merging if there are visual changes, master need to be able to run `--update-...`
- [ ] if we have visual changes, then it should be flagged in PR (maybe a comment, maybe a tag, maybe both?)
  - [ ] if visual changes disappear:
    - [ ] need to update GitHub PR tag
    - [ ] need to update/remove visual diff comments
    - [ ] need to clean up after accidental visual changes are fixed
- [ ] need some way to cleanup, a github action that cleans up when branch is deleted
- [ ] for master, we could introduce some visuals attached to a release tag?
  - [ ] we would save the baseline for this tag?
  - [ ] we would also save the diffs compared to last tag?

- j'ia un plugin qui permet de run des callback de test sur les stories
  - je lui donne des callback de test ?
  - je créé des callback pour l'accessibilité
  - je créé des callback pour les tests visuels
  - comment je fais pour permettre de focus sur l'un ou l'autre ? Il me faudrait des groupes


## OS & rendering issues

- First iteration => we commit baseline images
  - have to ALWAYS run on the same OS (VM)
    - CI should run `npm run test` everytime we submit a PR (& for every push) => same a preview
      - unless we have a `skip-visual-regressions-test` label on PR
      - MEANS that should be a separate command & maybe a separate test runner config
    - if FAILS
      - CI should report the failing files
      - => Where do we see the changes?!
- Second iteration => we send to Cellar
- Third iteration => split CI jobs to be more efficient

## We need a reporter

- We need a JSON reporter
  - to generate a list of components that failed the test
  - => would be added in a comment

- We need an HTML reporter
  - to see actual screenshots of failed tests & compare to baseline,
  - to see the new baseline
- We'll need to add status check & post status check

- Then we can handle the new baseline update stuff (labels are a bad idea cause anybody can set them, we could go for a comment to a bot? We'll need PAT anyway)

- Need to create a lit component or template for HTML maybe just use lit html`` => nah static HTML seems fine? Issue is sanitizing :thinking:
- We'll need a menu on the left
- Add link to preview vs link in prod
- GitHub comment in md (maybe some md reporter directly instead of JSON): list of impacted components (link to preview) (each story) if less than 50 failures? If not then only list components?

- We still need to deal with Cellar stuff

- every PR sync => would have been nice to check if we already have baseline based on hash :thinking:
  - checkout base commit, (GH Action's job)
  - update-visual-baseline,
    - path should be => branch name => then baseline (test runner's job)
    - should we deposit some kind of manifest with the base commit hash in there? YES good this way the cache system is independant (GH Action's job)
  - THEN
    - gco branch,
    - run tests-visual-regressions,



    HANDLE ALL ERRORS WITH ASYNC AWAIT

TODO: manifest to cache

- On echo chaque test result en fin de run =>

- On récupère le contenu de chaque result.json
- On créé un fichier JSON
- On met les Metadata (last update baseline)
- On met une catégorie results
- On met l'id du workflow si il y a
- Numéro de PR
- on merge tout dans results
