import { render, screen } from '@testing-library/svelte';
import Twitter from "$lib/components/Twitter/Twitter.svelte";

describe('twitter conditional render', () => {
  it('should not render twitter content if user is not logged in', () => {
    render(Twitter, {'twtUser': null});
    const node = screen.getByText('You are not logged in');
    expect(node).not.toBeNull();
  });
  it('should render twitter content if user is logged in', () => {
    render(Twitter, {'twtUser': 'twitteruser'});
    const node = screen.getByText('Welcome @twitteruser');
    expect(node).not.toBeNull();
  });
});

// TODO: Twitter mocking tests.