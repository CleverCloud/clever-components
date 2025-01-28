import {
  iconRemixUserForbidFill as iconConnectionLimit,
  iconRemixCpuLine as iconCpu,
  iconRemixDatabase_2Fill as iconDatabase,
  iconRemixHardDrive_2Fill as iconDisk,
} from '../../assets/cc-remix.icons.js';
import { DEFAULT_PLANS, THIRD_PARTY } from '../../stories/fixtures/plans.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-badge/cc-badge.js';
import './cc-plan-picker.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-plan-picker>',
  component: 'cc-plan-picker',
};

/**
 * @typedef {import('./cc-plan-picker.js').CcPlanPicker} CcPlanPicker
 */

const conf = {
  component: 'cc-plan-picker',
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcPlanPicker>>} */
  items: [
    {
      name: 'plan',
      plans: DEFAULT_PLANS,
      value: 'plan_12',
    },
  ],
});

export const readonly = makeStory(conf, {
  /** @type {Array<Partial<CcPlanPicker>>} */
  items: [
    {
      name: 'plan',
      plans: DEFAULT_PLANS,
      readonly: true,
      value: 'plan_12',
    },
  ],
});

export const sampleDatabase = makeStory(conf, {
  /** @type {Array<Partial<CcPlanPicker>>} **/
  items: [
    {
      name: 'plan',
      plans: [
        {
          name: 'S',
          id: 's',
          details: [
            {
              icon: iconDisk,
              value: '128MB Disk Size',
            },
            {
              icon: iconCpu,
              value: '1 vCPUs',
            },
            {
              icon: iconConnectionLimit,
              value: '100 connections limit',
            },
            {
              icon: iconDatabase,
              value: '1 databases',
            },
          ],
        },
        {
          name: 'M',
          id: 'm',
          details: [
            {
              icon: iconDisk,
              value: '256MB Disk Size',
            },
            {
              icon: iconCpu,
              value: '1 vCPUs',
            },
            {
              icon: iconConnectionLimit,
              value: '250 connections limit',
            },
            {
              icon: iconDatabase,
              value: '5 databases',
            },
          ],
        },

        {
          name: 'L',
          id: 'l',
          details: [
            {
              icon: iconDisk,
              value: '512MB Disk Size',
            },
            {
              icon: iconCpu,
              value: '1 vCPUs',
            },
            {
              icon: iconConnectionLimit,
              value: '500 connections limit',
            },
            {
              icon: iconDatabase,
              value: '10 databases',
            },
          ],
        },
        {
          name: 'XL',
          id: 'xl',
          details: [
            {
              icon: iconDisk,
              value: '1GB Disk Size',
            },
            {
              icon: iconCpu,
              value: '1 vCPUs',
            },
            {
              icon: iconConnectionLimit,
              value: '500 connections limit',
            },
            {
              icon: iconDatabase,
              value: '10 databases',
            },
          ],
        },
        {
          name: '2XL',
          id: '2xl',
          details: [
            {
              icon: iconDisk,
              value: '2.5GB Disk Size',
            },
            {
              icon: iconCpu,
              value: '1 vCPUs',
            },
            {
              icon: iconConnectionLimit,
              value: '750 connections limit',
            },
            {
              icon: iconDatabase,
              value: '10 databases',
            },
          ],
        },
        {
          name: '3XL',
          id: '3xl',
          details: [
            {
              icon: iconDisk,
              value: '5GB Disk Size',
            },
            {
              icon: iconCpu,
              value: '1 vCPUs',
            },
            {
              icon: iconConnectionLimit,
              value: '1000 connections limit',
            },
            {
              icon: iconDatabase,
              value: '20 databases',
            },
          ],
        },
        {
          name: '4XL',
          id: '4xl',
          details: [
            {
              icon: iconDisk,
              value: '10GB Disk Size',
            },
            {
              icon: iconCpu,
              value: '1 vCPUs',
            },
            {
              icon: iconConnectionLimit,
              value: '1500 connections limit',
            },
            {
              icon: iconDatabase,
              value: '20 databases',
            },
          ],
        },
      ],
      value: 's',
    },
  ],
});

export const thirdParty = makeStory(conf, {
  /** @type {Array<Partial<CcPlanPicker>>} */
  items: [
    {
      name: 'plan',
      plans: THIRD_PARTY,
      value: 'third_party_1',
    },
  ],
});

export const thirdPartyReadonly = makeStory(conf, {
  /** @type {Array<Partial<CcPlanPicker>>} */
  items: [
    {
      name: 'plan',
      plans: THIRD_PARTY,
      readonly: true,
      value: 'third_party_1',
    },
  ],
});
