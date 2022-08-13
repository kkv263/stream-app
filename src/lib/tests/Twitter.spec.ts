import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Twitter from "$lib/components/Twitter/Twitter.svelte";

test("says 'hello world!'", () => {
    render(Twitter);
    const node = screen.queryByText("Hello world!");
    expect(node).not.toBeNull();
})