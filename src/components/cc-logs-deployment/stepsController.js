
export class StepsController {
  constructor (steps) {
    this.steps = steps;
  }

  getLastStep () {
    return this.steps.length > 0 ? this.steps[this.steps.length - 1] : null;
  }

  setDetail (detail) {
    const lastStep = this.getLastStep();
    if (lastStep == null) {
      return;
    }

    if (lastStep.sub.length > 0) {
      this.steps = [
        ...this.steps.slice(0, -1),
        {
          ...lastStep,
          sub: [
            ...lastStep.sub.slice(0, -1),
            {
              ...lastStep.sub[lastStep.sub.length - 1],
              detail,
            },
          ],
        },
      ];
    }
    else {
      this.steps = [
        ...this.steps.slice(0, -1),
        {
          ...lastStep,
          detail,
        },
      ];
    }
  }

  addLog (log) {
    this.addLogs([log]);
  }

  addLogs (logs) {
    const lastStep = this.getLastStep();
    if (lastStep == null) {
      return;
    }

    this.steps = [
      ...this.steps.slice(0, -1),
      {
        ...lastStep,
        logs: [...(lastStep.logs ?? []), ...logs],
      },
    ];
  }

  error () {
    const lastStep = this.getLastStep();
    if (lastStep == null) {
      return;
    }

    this.steps = [
      ...this.steps.slice(0, -1),
      {
        ...lastStep,
        state: 'error',
        sub: [
          ...lastStep.sub.slice(0, -1),
          {
            ...lastStep.sub[lastStep.sub.length - 1],
            state: 'error',
          },
        ],
      },
      {
        name: 'deployment-error',
        group: true,
        state: 'error',
        sub: [],
      },
    ];
    this.addStep('deployment-after-error', { group: false, intent: 'warning', final: true });
  }

  success () {
    this.addStep('deployment-success', { group: true, intent: 'normal', final: false });
    this.addStep('deployment-url', { group: false, intent: 'info', final: false });
    this.addStep('deployment-duration', { group: false, intent: 'info', final: true });
  }

  addStep (stepId, { group = false, intent = 'normal', final = false }) {
    const lastStep = this.getLastStep();

    const parseStepId = (id) => {
      const split = id.split('/');
      if (split.length === 1) {
        return {
          name: id,
        };
      }
      else {
        return {
          name: split[0],
          sub: split[1],
        };
      }
    };

    const newStep = parseStepId(stepId);

    const newStepModel = (parsedStep) => {

      if (parsedStep.sub != null) {
        return {
          name: parsedStep.name,
          state: final ? 'done' : 'loading',
          end: final ? new Date() : null,
          start: new Date(),
          final,
          sub: [
            {
              name: parsedStep.sub,
              state: final ? 'done' : 'loading',
              final,
              intent,
              start: new Date(),
              end: final ? new Date() : null,
            },
          ],
        };
      }
      else {
        return {
          name: parsedStep.name,
          state: final ? 'done' : 'loading',
          final,
          group,
          intent,
          sub: [],
          start: new Date(),
          end: final ? new Date() : null,
        };
      }
    };

    if (lastStep == null) {
      this.steps = [newStepModel(newStep)];
    }
    else if (lastStep.name !== newStep.name) {
      // make last step done
      // and add new step

      if (lastStep.sub.length === 0) {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            state: 'done',
            end: new Date(),
          },
          newStepModel(newStep),
        ];
      }
      else {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            sub: [
              ...lastStep.sub.slice(0, -1),
              {
                ...lastStep.sub[lastStep.sub.length - 1],
                state: 'done',
                end: new Date(),
              },
            ],
            state: 'done',
            end: new Date(),
          },
          newStepModel(newStep),
        ];
      }
    }
    else {

      if (lastStep.sub.length === 0) {
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            final,
            state: final ? 'done' : 'loading',
            end: final ? new Date() : null,
            sub: [
              {
                name: newStep.sub,
                state: final ? 'done' : 'loading',
                final,
                intent,
                start: new Date(),
                end: final ? new Date() : null,
              },
            ],
          },
        ];
      }
      else {
        // modify last sub step and add the sub step
        this.steps = [
          ...this.steps.slice(0, -1),
          {
            ...lastStep,
            final,
            state: final ? 'done' : 'loading',
            end: final ? new Date() : null,
            sub: [
              ...lastStep.sub.slice(0, -1),
              {
                ...lastStep.sub[lastStep.sub.length - 1],
                state: 'done',
                end: new Date(),
              },
              {
                name: newStep.sub,
                state: final ? 'done' : 'loading',
                final,
                intent,
                start: new Date(),
                end: final ? new Date() : null,
              },
            ],
          },
        ];
      }
    }

    console.log(this.steps);
  }

  isDone () {
    const lastStep = this.getLastStep();
    return lastStep != null && lastStep.final && lastStep.state === 'done';
  }
}
