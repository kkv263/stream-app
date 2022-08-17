// import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
// import { get } from 'svelte/store';
// import { authModalState } from "$lib/stores/authModalStore";
// import AuthModal from '$lib/components/Auth/AuthModal.svelte';

// TODO: TESTS ARE NOT WORKING CORRECTLY IT SEEMS.
// Look into getting this working with SSR => Auth Login goto seems to break it.

// describe('modal initial state', () => {
//   it('should have an empty state as the initial value', () => {
//     const value = get(authModalState);
//     expect(value).toEqual('');
//   });
// });

// describe('auth modal signup flow', () => {
//   it('should have a signup header when passed signup state', () => {
//     setStateAndCheckText('signup', 'Sign up');
//   });

//   it('should switch to login when clicked on "login to potion" in signup state', () => {
//     checkStateAfterBtnPress('signup', 'Login to Potion', 'Login')
//   });
//   it('should not go to step 2 if input is invalid', () => {
//     inputAuthFieldsAndSubmit ('signup', 'test', '1234')
//     const invalid = screen.getByText('Sign up');
//     expect(invalid).not.toBeNull();
//   });
//   it('should go to step 2 if input is valid format submitting signup form', async() => {
//     inputAuthFieldsAndSubmit ('signup', 'test@yahoo.com', 'P@ssw0rd!')
//     const valid = await screen.findByText('Almost there!');
//     expect(valid).not.toBeNull();
//   });
//   it('should go to step 2 with valid input and should be able to go back to step 1', async() => {
//     inputAuthFieldsAndSubmit ('signup', 'test@yahoo.com', 'P@ssw0rd!')
//     const btn = await screen.findByText('back');
//     fireEvent.click(btn);
//     const node = await screen.findByText('Sign up');
//     expect(node).not.toBeNull();
//   });

//   // TODO: Form submits for invalid and valid inputs Step 2 (supabase)
//   // TODO: Clicking on twitch / other platform signin/up
// });

// describe('auth modal login flow', () => {
//   it('should have a login header when passed signup state', () => {
//     setStateAndCheckText('login', 'Login');
//   });
//   it('should switch to signup when clicked on "signup for potion" in login state', async () => {
//     checkStateAfterBtnPress('login', 'Sign up for Potion', 'Sign up')
//   });
//   it('should switch to forgot when clicked on "forgot password?" in login state', async () => {
//     checkStateAfterBtnPress('login', 'Forgot Password?', 'Forgot Password?')
//   });
//   // TODO: Form submits for invalid and valid inputs (supabase)
//   // TODO: Clicking on twitch / other platform signin/up
// });

// describe('auth modal forgot flow', () => {
//   it('should have a forgot password header when passed forgot state', () => {
//     setStateAndCheckText('forgot', 'Forgot Password?');
//   });
//   it('should switch to login after hitting "back" in forgot state', () => {
//     checkStateAfterBtnPress('forgot', 'back', 'Login')
//   });
//   // TODO: Form submits for invalid and valid inputs (supabase)
//   // Step 2
// });

// const inputAuthFieldsAndSubmit = (state:string, emailValue:string, pwValue:string) => {
//   authModalState.set(state)
//   render(AuthModal);
//   const form = screen.getByTestId(`auth-form__${state}`);
//   const emailInput = screen.getByTestId('email-input');
//   const pwInput = screen.getByTestId('password-input');
//   fireEvent.change(emailInput, {target: {value: emailValue}})
//   fireEvent.change(pwInput, {target: {value: pwValue}})
//   fireEvent.submit(form);
// }

// const setStateAndCheckText = (state:string, findText:string) => {
//   authModalState.set(state) 
//   render(AuthModal);
//   const node = screen.getByText(findText);
//   expect(node).not.toBeNull();
// }

// //TODO: Check again
// const checkStateAfterBtnPress = async (state:string, btnText:string, findText:string) => {
//   authModalState.set(state)
//   render(AuthModal);
//   const btn = screen.getByText(btnText);
//   fireEvent.click(btn);
//   const node = await screen.findByText(findText);
//   expect(node).not.toBeNull();
// }