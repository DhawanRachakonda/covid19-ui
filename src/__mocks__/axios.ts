const defaultResponse = { data: {} };

let error = false;

export function setError(value: boolean) {
  error = value;
}

const createInstance = (response = defaultResponse) =>
  error ? Promise.reject(response) : Promise.resolve(response);

createInstance.get = jest.fn(() => Promise.resolve(defaultResponse));
createInstance.put = jest.fn(() => Promise.resolve(defaultResponse));
createInstance.post = jest.fn(() => Promise.resolve(defaultResponse));
createInstance.delete = jest.fn(() => Promise.resolve(defaultResponse));
createInstance.interceptors = { request: { use: jest.fn() } };
createInstance.defaults = { headers: { common: {} } };

const __mock = {
  reset() {
    Object.assign(__mock.instance, {
      get: jest.fn(() => Promise.resolve(defaultResponse)),
      put: jest.fn(() => Promise.resolve(defaultResponse)),
      post: jest.fn(() => Promise.resolve(defaultResponse)),
      delete: jest.fn(() => Promise.resolve(defaultResponse)),
      create: jest.fn(),
      interceptors: { request: { use: jest.fn() } },
      defaults: { headers: { common: {} } }
    });
    setError(false);
  },
  instance: {}
};

__mock.reset();

export default {
  __mock,
  get: jest.fn(() => Promise.resolve(defaultResponse)),
  put: jest.fn(() => Promise.resolve(defaultResponse)),
  post: jest.fn(() => Promise.resolve(defaultResponse)),
  delete: jest.fn(() => Promise.resolve(defaultResponse)),
  create: () => __mock.instance,
  defaults: { headers: { common: {} } },
  setError
};
