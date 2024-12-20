# PR #1

- [x] delete all component test files
- [x] create plugin to run tests on stories
- [x] move accessibility tests in test-stories helper
- [x] add groups

# PR #2

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
