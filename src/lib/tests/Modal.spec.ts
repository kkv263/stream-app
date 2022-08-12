import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/svelte';
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
    closeModalAndCheckModal(btn)
  });
  it('closing modal with backdrop should not show modal', async() => {
    render(Modal);
    const node = screen.getByTestId("modal__backdrop");
    closeModalAndCheckModal(node)
  });
});

const closeModalAndCheckModal = (btn: HTMLElement) => {
  fireEvent.click(btn)
  waitForElementToBeRemoved(document.querySelector('aside.modal'));
}