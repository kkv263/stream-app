import { render, screen } from '@testing-library/svelte';
import Twitter from "../components/Twitter.svelte";

test("says 'hello world!'", () => {
    render(Twitter);
    const node = screen.queryByText("Hello world!");
    expect(node).not.toBeNull();
})