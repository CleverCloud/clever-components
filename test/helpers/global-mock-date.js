const fakeNow = new Date('2023-10-26T12:00:00.000Z').getTime();
window.Date = class extends Date {
  static now() {
    return fakeNow;
  }

  // @ts-ignore
  constructor(...options) {
    if (options.length > 0) {
      // @ts-ignore
      super(...options);
    } else {
      super(fakeNow);
    }
  }
};
