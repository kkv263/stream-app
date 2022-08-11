import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/svelte';
// import { get } from 'svelte/store';
// import { authModalState } from "$lib/stores/authModalStore";
import Modal from "$lib/components/global/Modal.svelte";

describe('modal content', () => {
  it('close button should have x', () => {
    render(Modal);
    const node = screen.getByText("×");
    expect(node).not.toBeNull();
  });
  it('should have modal backdrop', () => {
    render(Modal);
    const node = screen.getByTestId("modal__backdrop");
    expect(node).not.toBeNull();
  })
  it('closing modal with x should not show modal', async() => {
    render(Modal);
    const btn = screen.getByText("×");
    fireEvent.click(btn)
    waitForElementToBeRemoved(document.querySelector('aside.modal'));
  });
  it('closing modal with backdrop should not show modal', async() => {
    render(Modal);
    const node = screen.getByTestId("modal__backdrop");
    fireEvent.click(node)
    waitForElementToBeRemoved(document.querySelector('aside.modal'));
  });
});

// TODO: Move this into auth modal tests.
// describe('modal states', () => {
//   it('should have an empty state as the initial value', () => {
//     expect.hasAssertions();
//     const value = get(authModalState);
//     expect(value).toEqual('');
//   });
// });