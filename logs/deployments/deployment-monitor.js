import { getApi } from '../utils/api.js';
import { Recorder } from '../utils/recorder.js';

const ownerId = 'user_f704a8cf-28d5-449d-b269-1db6a2e932c7';
const appId = 'app_3af80970-d8bf-47ab-af5c-e56fb6c481f4';
const api = getApi(ownerId, appId, process.env);
const recorder = new Recorder(api);

recorder.start(() => {
  console.clear();
  recorder.printResult();
}).then();
