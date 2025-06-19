const OriginalDate = Date;
console.log('MOCKING DATE');
Date = class MockedDate extends OriginalDate {
  constructor() {
    super();

    return new OriginalDate('2024-02-02T10:00:00');
  }

  static now() {
    return new OriginalDate('2024-02-02T10:00:00');
  }

  getTime() {
    return new OriginalDate('2024-02-02T10:00:00').getTime();
  }
};
