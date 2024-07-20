import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/preact';

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
