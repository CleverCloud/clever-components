const warningSvg = new URL('../../../src/assets/warning.svg', import.meta.url);

const baseProperties = [
  { innerHTML: 'Skeleton', skeleton: true },
  { innerHTML: 'Simple' },
  { innerHTML: 'Primary', primary: true },
  { innerHTML: 'Success', success: true },
  { innerHTML: 'Warning', warning: true },
  { innerHTML: 'Danger', danger: true },
  { innerHTML: 'Button link', link: true },
];

// const circleProperties = [{ circle: false }, { circle: true }];
// const delayProperties = [{ delay: null }, { delay: 3 }, { delay: 0 }];
// const disabledProperties = [{ disabled: false }, { disabled: true }];
// const hideTextProperties = [{ hideText: false }, { hideText: true }];
// const imageProperties = [{ image: null }, { image: warningSvg }];
// const outlinedProperties = [{ outlined: false }, { outlined: true }];
// const waitingProperties = [{ waiting: false }, { waiting: true }];
//
// export const variants = [];
//
// for (const circle of circleProperties) {
//   for (const delay of delayProperties) {
//     for (const disabled of disabledProperties) {
//       for (const hideText of hideTextProperties) {
//         for (const image of imageProperties) {
//           for (const outlined of outlinedProperties) {
//             for (const waiting of waitingProperties) {
//               for (const base of baseProperties) {
//                 variants.push({
//                   ...circle,
//                   ...delay,
//                   ...disabled,
//                   ...hideText,
//                   ...image,
//                   ...outlined,
//                   ...waiting,
//                   ...base,
//                 });
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }

const delayProperties = [{ delay: null }, { delay: 3 }];
const imageCircleHideTextProperties = [
  { image: null, hideText: false, circle: false },
  { image: warningSvg, hideText: false, circle: false },
  { image: warningSvg, hideText: true, circle: false },
  { image: warningSvg, hideText: false, circle: true },
  { image: warningSvg, hideText: true, circle: true },
];
const outlinedProperties = [{ outlined: false }, { outlined: true }];
const disabledWaitingProperties = [
  { disabled: false, waiting: false },
  { disabled: false, waiting: true },
  { disabled: true, waiting: false },
  // { disabled: true, waiting: true },
];

export const variants = [];

for (const delay of delayProperties) {
  for (const imageCircleHideText of imageCircleHideTextProperties) {
    for (const outlined of outlinedProperties) {
      for (const disabledWaiting of disabledWaitingProperties) {
        for (const base of baseProperties) {
          variants.push({
            ...base,
            ...imageCircleHideText,
            ...delay,
            ...imageCircleHideText,
            ...outlined,
            ...disabledWaiting,
          });
        }
      }
    }
  }
}

export const style = `
  body {
    margin: 1em;
    display: grid;
    grid-template-columns: repeat(${baseProperties.length}, auto);
    justify-content: start;
    gap: 1em;
    justify-items: start;
  }
  
  body > * {
    margin: 0;
  }
`;
