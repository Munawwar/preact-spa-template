import { describe, it, expect } from 'vitest';
import { render, waitFor, screen } from '@testing-library/preact';

import Home from '../src/routes/Home';

describe('Home', () => {
  it('should contain "you are at" text', async () => {
    render(<Home title="Home" />);
    await waitFor(() => {
      expect(
        screen.getByText('You are at the Home page', {
          exact: false,
          collapseWhitespace: true,
        })
      ).toBeInTheDocument();
    });
  });
});

