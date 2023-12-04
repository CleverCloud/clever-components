export function updateSummary (data) {
  const { name, label, logo, zone } = data;

  const summaryElt = document.body.querySelector('.summary');
  const summaryServiceLogo = summaryElt.querySelector('.ss-logo');
  const summaryServiceName = summaryElt.querySelector('.ss-name');

  summaryServiceLogo.innerHTML = `<img src="${logo}" alt="${name}">`;
  summaryServiceName.innerHTML = name;

  const nameElt = summaryElt.querySelector('.ss-block.name');
  const nameContentElt = nameElt.querySelector('.block-content');

  nameContentElt.innerHTML = `${label}`;

  const zoneElt = summaryElt.querySelector('.ss-block.zone');
  const zoneContentElt = zoneElt.querySelector('.block-content');

  zoneContentElt.innerHTML = `
    <div>${zone.city} - ${zone.name}</div>
    <code>${zone.tags.join(', ')}</code>
  `;
}
