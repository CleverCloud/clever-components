import './cc-tcp-redirection-form.js';
import './cc-tcp-redirection-form.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🛠 TCP Redirections/<cc-tcp-redirection-form>',
  component: 'cc-tcp-redirection-form',
};

const conf = {
  component: 'cc-tcp-redirection-form',
};

/**
 * @typedef {import('./cc-tcp-redirection-form.js').CcTcpRedirectionForm} CcTcpRedirectionForm
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormStateLoaded} TcpRedirectionFormStateLoaded
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormStateLoading} TcpRedirectionFormStateLoading
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormStateError} TcpRedirectionFormStateError
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormContextType} TcpRedirectionFormContextType
 */
export const defaultStory = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} */
    state: {
      type: 'loaded',
      redirections: [
        { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 },
        { type: 'loaded', namespace: 'cleverapps', isPrivate: false },
      ],
    },
  }],
});

export const empty = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} **/
    state: {
      type: 'loaded',
      redirections: [],
    },
  }],
});

export const loading = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateLoading} **/
    state: {
      type: 'loading',
    },
  }],
});

export const errorWithLoading = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateError} **/
    state: {
      type: 'error',
    },
  }],
});

export const dataLoaded = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} **/
    state: {
      type: 'loaded',
      redirections: [
        { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 },
        { type: 'loaded', namespace: 'cleverapps', isPrivate: false },
        { type: 'loaded', namespace: 'customer-name', sourcePort: 6440, isPrivate: true },
      ],
    },
  }],
});

export const dataLoadedWithContextAdmin = makeStory(conf, {
  docs: 'When `context="admin"` is used, the component description is hidden, the block is collapsed and a redirection counter bubble is be displayed.',
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} **/
    state: {
      type: 'loaded',
      redirections: [
        { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 },
        { type: 'loaded', namespace: 'cleverapps', isPrivate: false },
        { type: 'loaded', namespace: 'customer-name', sourcePort: 6440, isPrivate: true },
      ],
    },
    context: 'admin',
  }],
});

export const dataLoadedWithContextAdminAndNoRedirections = makeStory(conf, {
  docs: 'When `context="admin"` is used, the counter bubble is not displayed if there is no redirection.',
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} **/
    state: {
      type: 'loaded',
      redirections: [
        { type: 'loaded', namespace: 'default', isPrivate: false },
        { type: 'loaded', namespace: 'cleverapps', isPrivate: false },
        { type: 'loaded', namespace: 'customer-name', isPrivate: true },
      ],
    },
    /** @type {TcpRedirectionFormContextType} **/
    context: 'admin',
  }],
});

export const dataLoadedWithCreatingRedirection = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} **/
    state: {
      type: 'loaded',
      redirections: [
        { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 },
        { type: 'waiting', namespace: 'cleverapps', isPrivate: false },
        { type: 'loaded', namespace: 'customer-name', sourcePort: 6440, isPrivate: true },
      ],
    },
  }],
});

export const dataLoadedWithDeletingRedirection = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} **/
    state: {
      type: 'loaded',
      redirections: [
        { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 },
        { type: 'loaded', namespace: 'cleverapps', isPrivate: false, sourcePort: 3821 },
        { type: 'waiting', namespace: 'customer-name', sourcePort: 6440, isPrivate: true },
      ],
    },
  }],
});

export const dataLoadedWithManyNamespaces = makeStory(conf, {
  items: [{
    /** @type {TcpRedirectionFormStateLoaded} **/
    state: {
      type: 'loaded',
      redirections: [
        { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 874 },
        { type: 'loaded', namespace: 'cleverapps', isPrivate: false, sourcePort: 12345 },
        { type: 'loaded', namespace: 'secondary', isPrivate: false, sourcePort: 99 },
        { type: 'loaded', namespace: 'customer-name-one', isPrivate: false, sourcePort: 1234 },
        { type: 'loaded', namespace: 'customer-name-two', isPrivate: false, sourcePort: 4321 },
        { type: 'loaded', namespace: 'customer-name-three', isPrivate: false },
        { type: 'loaded', namespace: 'customer-name-four', isPrivate: false, sourcePort: 7531 },
        { type: 'loaded', namespace: 'customer-name-five', isPrivate: false },
        { type: 'loaded', namespace: 'customer-name-six', isPrivate: false },
        { type: 'loaded', namespace: 'customer-name-seven', isPrivate: false, sourcePort: 3456 },
      ],
    },
  }],
});

export const simulation = makeStory(conf, {
  items: [
    { state: { type: 'loading' } },
    { state: { type: 'loading' } },
  ],
  simulations: [
    storyWait(2000,
      /** @param {[CcTcpRedirectionForm, CcTcpRedirectionForm]} components */
      ([component, componentError]) => {
        component.state = {
          type: 'loaded',
          redirections: [
            { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 },
            { type: 'loaded', namespace: 'cleverapps', isPrivate: false },
          ],
        };
        componentError.state = { type: 'error' };
      }),
    storyWait(1000,
      /** @param {[CcTcpRedirectionForm]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          redirections: [
            { type: 'loaded', namespace: 'default', isPrivate: false, sourcePort: 5220 },
            { type: 'waiting', namespace: 'cleverapps', isPrivate: false },
          ],
        };
      }),
    storyWait(1500,
      /** @param {[CcTcpRedirectionForm]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          redirections: [
            { type: 'waiting', namespace: 'default', isPrivate: false, sourcePort: 5220 },
            { type: 'waiting', namespace: 'cleverapps', isPrivate: false },
          ],
        };
      }),
    storyWait(1500,
      /** @param {[CcTcpRedirectionForm]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          redirections: [
            { type: 'waiting', namespace: 'default', isPrivate: false, sourcePort: 5220 },
            { type: 'loaded', namespace: 'cleverapps', isPrivate: false, sourcePort: 4242 },
          ],
        };
      }),
    storyWait(1500,
      /** @param {[CcTcpRedirectionForm]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          redirections: [
            { type: 'loaded', namespace: 'default', isPrivate: false },
            { type: 'loaded', namespace: 'cleverapps', isPrivate: false, sourcePort: 4242 },
          ],
        };
      }),
  ],
});
