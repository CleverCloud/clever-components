// imports
import { ADDON_IDS, getAddonFromId, getAddonMetadataFromId, getEnhancedPlansFromId } from './scripts/addons.js';
import { APP_TYPES_AND_SLUGS, getAppFromTypeAndSlug } from './scripts/apps.js';
import { updateSummary } from './scripts/form.js';
import { getZoneFromName, ZONES } from './scripts/zones.js';

const iconRemixCheckboxCircleFill = { content: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.413-1.414-5.657 5.657-2.829-2.829-1.414 1.414L11.003 16z"/></svg>' };

export const iconRemixLeafFill = { content: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.998 3v2c0 9.627-5.373 14-12 14H7.096c.212-3.012 1.15-4.835 3.598-7.001 1.204-1.065 1.102-1.68.509-1.327C7.119 13.102 5.09 16.386 5 21.63l-.003.37h-2c0-1.363.116-2.6.346-3.732-.23-1.294-.346-3.05-.346-5.268 0-5.523 4.477-10 10-10 2 0 4 1 8 0z"/></svg>' };

// current state
let serviceLabel = '';
let currentZoneName = 'par';
let currentPlanCategory = null;
let currentPlanCustomIndex = 0;

// FORM - service name
async function generateServicePassphrase () {
  const response = await fetch('https://makemeapassword.ligos.net/api/v1/passphrase/json?wc=4&pc=1&sp=y');
  const phrase = await response.json();
  serviceLabel = phrase.pws.join(' ').replaceAll(' ', '-');
  serviceNameInput.value = serviceLabel;
}

const serviceNameInput = document.body.querySelector('.service-name cc-input-text');
function onServiceNameUpdate () {
  serviceLabel = serviceNameInput.value;
  globalUpdate(true);
}

generateServicePassphrase().then(() => {
  serviceNameInput.addEventListener('input', onServiceNameUpdate);
  globalUpdate();
});

// FORM - zone input
const getTagFromKey = (key, tags) => tags.find((tag) => tag.startsWith(key));
const getValueFromRawTag = (rawTag) => rawTag.split(':')[1];

const zonePickerWrapper = document.body.querySelector('.zone-picker-wrapper');
zonePickerWrapper.innerHTML = ZONES.map((zone) => {
  const infraTag = getTagFromKey('infra', zone.tags);
  const infraValue = infraTag ? getValueFromRawTag(infraTag) : '';
  const infraLogoUrl = `assets/logos-square/${infraValue.toLowerCase()}.svg`;
  const countryUrl = `https://assets.clever-cloud.com/flags/${zone.countryCode.toLowerCase()}.svg`;
  const greenTag = getTagFromKey('green', zone.tags);

  return `<div class="zone-item" data-id="${zone.name}">
    <div class="zone-item--title">
      <span class="zi-infra">${zone.name}</span>
      <span class="zi-city">${zone.city}</span>
    </div>
    <div class="zone-item--thumbnails">
      <img class="zone-item--thumbnail zi-flag" src="${countryUrl}" alt="${zone.country}">
      <img class="zone-item--thumbnail zi-logo" src="${infraLogoUrl}" alt="${infraValue}">
      ${
        greenTag === 'green'
        ? `<cc-icon class="zone-item--thumbnail zi-green" icon='${JSON.stringify(iconRemixLeafFill)}'></cc-icon>`
        : ``
      }
    </div>
    <cc-icon class="zone-item--icon-selected" size="lg" icon='${JSON.stringify(iconRemixCheckboxCircleFill)}'></cc-icon>
  </div>`;
}).join('');

const zonePickerItems = zonePickerWrapper.querySelectorAll('.zone-item');
function updateZonePicker () {
  zonePickerItems.forEach((zoneItem) => {
    if (zoneItem.getAttribute('data-id') === currentZoneName) {
      zoneItem.setAttribute('selected', '');
    }
    else {
      zoneItem.removeAttribute('selected');
    }
  });
}
zonePickerItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    currentZoneName = e.currentTarget.getAttribute('data-id');
    updateZonePicker();
    globalUpdate(true);
  });
});

// FORM - plans
const planFormElement = document.body.querySelector('.form-element.plan-list .form-element--container');
const customizationFormWrapper = document.body.querySelector('.form-element.customization-list');
const customizationFormElement = document.body.querySelector('.form-element.customization-list .form-element--container');

function updatePlanPicker (soft) {
  planFormElement.querySelectorAll('.plan-item').forEach((planItem) => {
    if (planItem.getAttribute('data-category') === currentPlanCategory) {
      planItem.setAttribute('selected', '');
    }
    else {
      planItem.removeAttribute('selected');
    }
  });

  if (!soft) {
    globalUpdate(true);
  }
}
function updateCustomPicker (soft) {
  customizationFormElement.querySelectorAll('.plan-item').forEach((planItem) => {
    if (planItem.getAttribute('data-index') === currentPlanCustomIndex.toString()) {
      planItem.setAttribute('selected', '');
    }
    else {
      planItem.removeAttribute('selected');
    }
  });

  if (!soft) {
    globalUpdate(true);
  }
}

function updateCurrentPlans (resetIndex) {
  if (currentFormState !== 'addon') {
    return;
  }

  if (resetIndex) {
    currentPlanCategory = null;
  }

  const metadata = getAddonMetadataFromId(currentServiceId);
  const isPlanModeList = metadata.mode === 'list';
  const isPlanModeUnique = metadata.mode === 'unique';

  const enhancedPlans = getEnhancedPlansFromId(currentServiceId);

  function getFirstPlanFromCat (cat) {
    const plans = enhancedPlans[cat];
    return plans[0];
  }

  if (isPlanModeList) {
    if (metadata.categories) {
      customizationFormWrapper.removeAttribute('style');
    }
    else {
      customizationFormWrapper.setAttribute('style', 'display: none');
    }
    planFormElement.removeAttribute('style');

    planFormElement.innerHTML = `${
      Object.entries(enhancedPlans)
        .map(
          ([cat, plans], index) => {
            if (plans == null || plans.length <= 0) {
              return ``;
            }

            if (currentPlanCategory == null) {
              currentPlanCategory = cat;
            }

            const firstPlan = getFirstPlanFromCat(cat);
            return `<div class="plan-item" data-category="${cat}" data-index="${index}">
              <div class="plan-item--name">
                <span>${cat}</span>
                <cc-icon class="plan-item--icon-selected" icon='${JSON.stringify(iconRemixCheckboxCircleFill)}'></cc-icon>
              </div>
              <div class="plan-item--infos">
              ${
                metadata.features
                ? metadata.features.core
                  .map((value) => {
                    const feat = firstPlan.features.find((feat) => (metadata.nameProxy ? feat.name : feat.name_code) === value);
                    return `<span>${feat.value ? `${feat.value}&nbsp;` : ``} ${feat.name}</span>`;
                  })
                  .join(``)
                : ``
              }
              </div>
            </div>`;
          },
        )
        .join(`\n`)
    }`;
  }
  else if (isPlanModeUnique) {
    customizationFormWrapper.setAttribute('style', 'display: none');
    planFormElement.setAttribute('style', 'display: block');

    const uniquePlan = Object.values(enhancedPlans)[0][0];
    planFormElement.innerHTML = `
      <div>${uniquePlan.name}</div>
      ${
        uniquePlan.features
          .map((feat) => `<div>${feat.name ? `${feat.name}&nbsp;` : ``} &nbsp;${feat.value}</div>`)
          .join(``)
      }
    `;
  }

  if (isPlanModeUnique) {
    customizationFormWrapper.setAttribute('style', 'display: none');
    customizationFormElement.innerHTML = ``;
    return;
  }

  function refreshCustomizationZone () {
    const subPlans = enhancedPlans[currentPlanCategory];
    customizationFormElement.innerHTML = `${
      subPlans.map((plan, index) => {
        return `<div class="plan-item" data-index="${index}">
          <div class="plan-item--name">
            <span>${plan.name.replace(currentPlanCategory + ' ', '')}</span>
            <cc-icon class="plan-item--icon-selected" icon='${JSON.stringify(iconRemixCheckboxCircleFill)}'></cc-icon>
          </div>
          <div class="plan-item--infos">
          ${
            metadata.features
            ? metadata.features.nested
              .map((value) => {
                const feat = plan.features.find((feat) => feat.name_code === value);
                return `<span>${feat.value} ${feat.name}</span>`;
              })
            .join(``)
            : ``
          }
          </div>
        </div>`;
      })
      .join(``)
    }`;

    currentPlanCustomIndex = 0;

    const customFormItems = customizationFormElement.querySelectorAll('.plan-item');
    customFormItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        currentPlanCustomIndex = parseInt(e.currentTarget.getAttribute('data-index'));
        updateCustomPicker();
      });
    });

    updateCustomPicker();
  }

  if (metadata.categories) {
    refreshCustomizationZone();
  }

  const planFormItems = planFormElement.querySelectorAll('.plan-item');
  planFormItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      currentPlanCategory = e.currentTarget.getAttribute('data-category');
      updatePlanPicker();
      if (metadata.categories) {
        refreshCustomizationZone();
      }
    });
  });
}

// FORM - global management
const APP_SIZE = APP_TYPES_AND_SLUGS.length;
const ADDON_SIZE = ADDON_IDS.length;

let currentServiceIndex = 0;
let currentFormState = 'app';

let currentServiceId;
let currentService;

function goToNextService () {
  currentServiceIndex++;
  globalUpdate();
}
function goToPreviousService () {
  currentServiceIndex--;
  globalUpdate();
}

function globalUpdate (soft) {
  if (currentServiceIndex < 0) {
    currentServiceIndex = APP_SIZE + ADDON_SIZE - 1;
  }

  const looping = currentServiceIndex >= APP_SIZE + ADDON_SIZE;
  if (currentServiceIndex < APP_SIZE || looping) {
    currentFormState = 'app';

    if (looping) {
      currentServiceIndex = 0;
    }

    currentServiceId = APP_TYPES_AND_SLUGS[currentServiceIndex];
  }
  else if (currentServiceIndex < APP_SIZE + ADDON_SIZE) {
    currentFormState = 'addon';
    currentServiceId = ADDON_IDS[currentServiceIndex - APP_SIZE];
  }

  const isApp = currentFormState === 'app';

  const serviceGetterFn = isApp ? getAppFromTypeAndSlug : getAddonFromId;
  currentService = serviceGetterFn(currentServiceId);

  document.body.querySelector('main').setAttribute('data-service-id', currentService.type ?? currentService.id);

  document.body.setAttribute('data-type', currentFormState);

  if (!soft) {
    updateCurrentPlans(true);
    updatePlanPicker(true);
  }

  const data = {
    name: currentService.name,
    label: serviceLabel,
    logo: isApp ? currentService.variant.logo : currentService.logoUrl,
    zone: getZoneFromName(currentZoneName),
  };
  updateSummary(data);
}

// UI - keyboard
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight':
      goToNextService();
      break;
    case 'ArrowLeft':
      goToPreviousService();
      break;
  }
});

// UI - sidebar menu
const menu = document.body.querySelector('menu');
menu.addEventListener('click', () => toggleAttribute(menu, 'open'));

// misc
function toggleAttribute (element, attribute, value) {
  if (element.hasAttribute(attribute)) {
    element.removeAttribute(attribute);
  }
  else {
    element.setAttribute(attribute, value ?? '');
  }
}

// INIT
updateZonePicker();
globalUpdate();
