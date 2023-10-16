---
kind: '📌 Architecture Decision Records'
---

# ADR 0014: Why we internalized leaflet.heat and simpleheat

🗓️ 2021-05-21 · ✍️ Hubert Sablonnière

## The context

We've been using a [Leaflet](https://leafletjs.com/) plugin to display heat maps called: [leaflet.heat](https://github.com/Leaflet/Leaflet.heat).

This plugin is a CJS module.
It relies on Leaflet being present in the global namespace as `L`.
This caused a few problems in our modern ESM based project.
We managed to make it work so far with some workarounds.

We recently decided to use Leaflet as ESM and benefit from good treeshaking.
This is clearly not easy when you're dealing with CJS and global vars like this.
In the end, we missed a bug that only appeared when building for our CDN.

We clearly need this project to be exposed as an ES module.

## The problem

This project is not actively maintained.
The last commit on the source code is from August 2016.

Also, the project depends on [simpleheat](https://github.com/mourner/simpleheat), which is expected to be available as a global variable.

We can't really expect those projects to accept a contribution as radical as modifying the module exposition.

## The discarded solution

We could have chosen to:

* fork both projects
* update the source code to be exposed as ESM
* publish new versions on npm with the Clever Cloud org

This is a bit overkill to start maintaining 2 GitHub forks and release 2 new npm packages just for 2 files without any other dependencies but Leaflet.

## The solution

For now, we decided to internalize those projects in our own repo.
This is clearly simpler for us to work with.

Those projects were created by Vladimir Agafonkin and licensed with [`BSD-2-Clause`](https://spdx.org/licenses/BSD-2-Clause.html).

Here's what we did:

* Add a License section in our README to explain those details
* Copy the source of https://github.com/mourner/simpleheat `src/lib/simpleheat.js`
  * Add the License and copyright at the top of the file
  * Modify the source, so the file is exposed as an ES module
* Copy the source of https://github.com/Leaflet/Leaflet.heat `src/lib/leaflet-heat.js`
  * Add the License and copyright at the top of the file
  * Modify the source, so the file is exposed as an ES module
  * Modify the source, so it can properly import `Leaflet` and inner `simpleheat`  

We may decide to publish and maintain those forks or contribute them back if there's some interest.
