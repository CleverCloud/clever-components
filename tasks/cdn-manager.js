import fs from 'fs';
import superagent from 'superagent';
import { unique } from '../src/lib/utils.js';
import { LONG_CACHE, NO_CACHE } from './cellar-client.js';
import { describeTag, getCurrentAuthor, getCurrentCommit, getGitHubHeaders } from './git-utils.js';

/**
 * CDN entry
 *
 * @typedef {Object} ManifestEntry
 * @typedef {string} name - Name or Version.
 * @typedef {string} url - direct link to the entry.
 * @typedef {string} updatedAt - Date of last update.
 * @typedef {string} commitId - Hash of the commit.
 * @typedef {string} author - Author of the commit.
 */

const MANIFEST_FILE_NAME = 'manifest.json';
const MANIFEST_VERSION = 1;
const SOURCE_DIR = 'dist-cdn';

/**
 * The class manages CDN entries stored in a Clever Cloud Cellar addon.
 */
export class CdnManager {
  /**
   * @param {CdnEnvironment} cdnEnvironment
   */
  constructor (cdnEnvironment) {
    /** @type {CdnEnvironment} */
    this._env = cdnEnvironment;
    /** @type {CellarClient} */
    this._cellarClient = cdnEnvironment.createCellarClient();
  }

  /**
   * @param {string} name
   * @return {Promise<ManifestEntry>}
   */
  async createManifestEntry (name) {
    return {
      updatedAt: new Date().toISOString(),
      ...await this._fetchDescription(name),
      name,
      url: this._env.getCdnEntryUrl(name),
    };
  }

  /**
   * @param {string} name - The name of the CDN entry to get
   * @return {Promise<ManifestEntry>} - The CDN entry
   */
  async get (name) {
    const manifest = await this._getManifest();
    return manifest.entries.find((e) => e.name === name);
  }

  /**
   * Asserts that all the necessary files are present and that the CDN is ready to be published.
   * @param name - The CDN entry name
   */
  assertReadyToPublish (name) {
    if (!fs.existsSync(`${SOURCE_DIR}`)) {
      throw new Error(`Source directory '${SOURCE_DIR}' doesn't exist. You forgot the build phase!`);
    }
    if (!fs.existsSync(`${SOURCE_DIR}/${this._getDepsManifestFileName(name)}`)) {
      throw new Error(`Dependency manifest file '${SOURCE_DIR}/${this._getDepsManifestFileName(name)}' doesn't exist. Maybe you forgot the build phase or you built with a different CDN entry name!`);
    }
  }

  /**
   * Publish the CDN under the given name.
   *
   * @param {string} name - The name of the CDN entry to publish
   * @return {Promise<ManifestEntry>} - The created entry
   */
  async publish (name) {
    this.assertReadyToPublish(name);

    const manifestEntry = await this.createManifestEntry(name);

    // upload CDN files
    await this._cellarClient.sync({ localDir: SOURCE_DIR, cacheControl: LONG_CACHE });

    // add entry to manifest
    await this._updateManifest((manifest) => {
      const previewIndex = manifest.entries.findIndex((p) => p.name === manifestEntry.name);
      if (previewIndex !== -1) {
        manifest.entries[previewIndex] = manifestEntry;
      }
      else {
        manifest.entries.push(manifestEntry);
      }
      return manifest;
    });

    return manifestEntry;
  }

  /**
   *
   * @param name - The name of the CDN entry to delete
   * @return {Promise<ManifestEntry>} - The deleted entry
   */
  async remove (name) {
    const manifest = await this._getManifest();

    const entryIndex = manifest.entries.findIndex((p) => p.name === name);
    if (entryIndex === -1) {
      return null;
    }

    const entry = manifest.entries[entryIndex];

    // remove entry from manifest
    await this._updateManifest((manifest) => {
      manifest.entries.splice(entryIndex, 1);
      return manifest;
    });

    // find all useless files that can be deleted
    const dependencies = await this._getDependencies(name);
    const otherEntries = manifest.entries.filter((entry) => entry.name !== name);
    const otherDependencies = (await Promise.all(otherEntries.map((e) => this._getDependencies(e.name))))
      .flat()
      .flatMap(unique);

    const filesToDelete = dependencies.filter((f) => !otherDependencies.includes(f));

    filesToDelete.push(this._getDepsManifestFileName(name));
    filesToDelete.push(`visualizer-stats-${name}.html`);

    // delete useless files
    await this._cellarClient.deleteObjects(filesToDelete.map((f) => ({ key: f })));

    return entry;
  }

  /**
   * @param name - The CDN entry name
   * @return {Promise<boolean>} - Whether a CDN entry already exists for the given entry name.
   */
  async exists (name) {
    return (await this.get(name) != null);
  }

  /**
   * @return {Promise<Array<ManifestEntry>>} - The list of CDN entries
   */
  async list () {
    return (await this._getManifest()).entries;
  }

  async _updateManifest (updateFunction) {
    const manifest = await this._getManifest();
    const newManifest = updateFunction(manifest);
    await this._cellarClient.putObject({
      key: MANIFEST_FILE_NAME,
      body: JSON.stringify(newManifest),
      cacheControl: NO_CACHE,
    });
  }

  async _getManifest () {
    return this._cellarClient
      .getObject({ key: MANIFEST_FILE_NAME })
      .catch(() => {
        return {
          version: MANIFEST_VERSION,
          semver: this._env.semver,
          entries: [],
        };
      });
  }

  /**
   * @param {string} name
   * @return {Promise<Array<string>>}
   */
  async _getDependencies (name) {
    return (await this._cellarClient.getObject({ key: this._getDepsManifestFileName(name) }))
      .files
      .map((file) => file.path);
  }

  _getDepsManifestFileName (name) {
    return `deps-manifest-${name}.json`;
  }

  async _fetchDescription (cdnEntryName) {
    if (this._env.semver) {
      try {
        const response = await superagent
          .get(`https://api.github.com/repos/CleverCloud/clever-components/git/refs/tags/${cdnEntryName}`)
          .set(getGitHubHeaders());

        return describeTag(response.body);
      }
      catch (e) {
        if (e.status === 404) {
          throw new Error(`Git tag '${cdnEntryName}' could not be found on GitHub`);
        }
        throw e;
      }
    }

    return {
      commitId: getCurrentCommit(),
      author: getCurrentAuthor(),
    };
  }
}
