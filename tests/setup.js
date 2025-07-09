// Test setup file
const { JSDOM } = require('jsdom');

// Setup DOM environment for frontend tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.fetch = jest.fn();

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset fetch mock
  fetch.mockClear();
});