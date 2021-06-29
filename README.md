# AirBnB Clone Part 3

For this lab, interns will be creating a clone of AirBnB - a modern booking platform for local bed and breakfasts. This competitor application will be geared towards celebrities only, in the hopes of attracting the highest revenue customers to the platform. Celebrities should be able to sign up, list any of their personal residences, and let other celebrities book trips to stay in their houses.

The focus of this lab will be on constructing a complete authentication suite that offers the ability for users to confirm the email addresses they signed up with and reset their password if they need to.

## Things to Know

This lab will help SITE interns master:
+ Integrating an external service like Twilio Sendgrid into a Node/Express application
+ Sending password reset emails to users who forgot their password
+ Using cryptography to generate and store password-reset tokens in the database 
+ How to confirm users have valid email accounts
+ Managing query parameters in client-side and server-side urls

## Goals

For this application, you'll need to complete the following stages:

+ Stage 1 - Project Setup
  + Clone the frontend [repo](https://github.com/Jastor11/kavholm-finalized-ui)
  + Clone the backend starter [repo](https://github.com/Jastor11/kavholm-finalized-api)
  + Install the dependencies for both repos
  + Explore the repos
+ Stage 2 - Initialize database with SQL files
  + Run the sql scripts to create the necessary database and tables, as well as seed the database with starter data
  + Explore the backend repo code and examine the created tables with `psql`.
  + Create a `.env` file from the `.env-template` file. Modify any appropriate environment variables there. Open up the `config.js` file and modify any variables there as well.
+ Stage 3 - Integrate Twilio Sendgrid
  + We'll be using this service to send emails to users. 
  + Head to the Twilio SendGrid [page](https://sendgrid.com/free/)
    + Click the Try For Free button and enter in email and password.
    + Handle the Captcha and agree to their terms. Then can go ahead and fill out some personal information.
    + Next, click on the email api section. We'll be using their Web API. 
    + Select the Node.js client, give the new api key a name, and create it.
    + Keep this page open, as we'll need it for later
  + Update env vars and config
    + Store that api key in the Express API's `.env` file under the name `SENDGRID_API_KEY`. Add an `EMAIL_SERVICE_STATUS` env var as well.
    + Add the api key env var to the `config.js` file. Also include an `EMAIL_SERVICE_ACTIVE` config variable that is `false` when `IS_TESTING` is `true`, otherwise is `true` when `EMAIL_SERVICE_STATUS` is equal to `"active"`.
    + Export both of them
  + Install the `nodemailer` and `nodemailer-sendgrid` packages with `npm`.
  + Create a new directory called `services`
    + Add three files to it - `index.js`, `email.js`, `email.test.js`
    + Create the scaffolding code for an `EmailService` class and export it.
    + Write a test that ensures that an instance of the `EmailService` class has the `isActive` and `transport` properties attached to it.
    + Modify the `EmailService` constructor:
      + It should accept a config object with the `SENDGRID_API_KEY` and `EMAIL_SERVICE_ACTIVE` config vars.
      + It should create a `nodemailer` transport using `nodemailer-sendgrid` and the `SENDGRID_API_KEY`, then attach it to the instance
      + It should attach the `EMAIL_SERVICE_ACTIVE` variable to the `isActive` property on the instance.
      + Get the tests to pass
    + Export a properly configured instance of that service in the `index.js`  file.
+ Stage 4 - Testing the EmailService
  + Add a tests to the email service and a describe block
    + `Is inactive when testing` - make sure that whenever we're testing that an instance of the email service has the `isActive` property set to `false`
    + `Test sendEmail`
      + Add two tests to this describe block
      + `Returns 202 status code when all goes well` - ensures that when provided the proper email params, the `sendEmail` method returns an object with the `status` property set to `202`, the `email` sent, and an `error` property set to `null`.
      + `Returns 400 status code when email is missing to field` - ensures that when the `to` field is missing, the `sendEmail` method returns an object with the `status` property set to `400`, the `email` sent, and an `error` property set a valid description of the error.
  + Create a `sendEmail` method on the `EmailService`
    + It should accept an object containing the `from`, `to`, `subject` and `html` properties, which are then passed to the `transport`'s `sendMail` method to send the the email. 
    + If the `EmailService` is not active, it should **NOT** send the email and instead log that a fake email is being sent. It should return the right response depending on the email parameters supplied.
  + Make sure all the tests are passing.
+ Stage 5 - Storing Password Reset Tokens with the User Model
  + Create the necessary database modifications
    + Modify the `kavholm.sql` file
      + Add the `pw_reset_token` column as text
      + Add the `pw_reset_token_exp` as a timestamp
    + Re-initialize the db by running `psql -f kavholm.sql`
  + Create password reset token utils in `utils/tokens.js`
    + Import the `crypto` module
    + Export a `generateCryptoToken` function that takes in `numBytes` and uses the `crypto` module to return a Buffer array of pseudorandom bytes converted to a hexadecimal string
    + Export a `generatePasswordResetToken` function that returns an object containing a token resulting from calling the `generateCryptoToken` method with `20` num bytes and an expiration date set to an hour from the moment it was created. Convert the expiration date to an `ISO` formatted string.
  + Add tests to the `user.test.js` file
    + Import the `tokens` utils
    + Create a new describe block - `Test password reset`
      + Add a `User can store password reset token in the db` test
        + It should create a user, generate a password reset token for them, and then call the `savePasswordResetToken` method on the `User` class to save the users token in the db according to their email.
        + It should then fetch the user from the db and make sure the token and exp date are saved in the db
  + Implement the `savePasswordResetToken` method on the `User` class and get all the tests passing.
+ Stage 6 - Password Reset Method and Routes
  + Add more tests to `user.test.js`
    + `User can reset their password when supplying the correct token`
      + It should follow the same protocols as the previous test, but then call the `resetPassword` method on the `User` class afterwards with the reset token and a new password.
      + It should then check that their password has been changed, and the token and expiration date in the database have been set to null.
      + It should also ensure that the user can login with the new password
    + `Error is thrown when bad token is supplied`
      + It should follow the same protocols as the previous test
      + Aftewards, it should  call the `resetPassword` method on the `User` class afterwards with the wrong token and a new password inside a `try...catch` block and expect it to fail with a 400 error.
  + Implement the `resetPassword` method on the user class
    + It should hash the new password 
    + It should look up the user according to the password reset token and update their password to the new hashed password
    + It should set the token and expiration date to null
    + It should throw a 400 error when no user is found saying the token is expired or invalid
  + Add tests for the `/auth/recover` and `/auth/password-reset` routes in the `routes/auth.test.js` file
    + describe `POST /auth/recover`
      + `User can request password recovery and receive a success message`
        + Call the endpoint with any email and expect a 200 response with a message saying the email will be sent out if that account exists.
        + Ensure the `EmailService`'s `sendEmail` method was called
    + describe `POST /password-reset`
      + `User with valid token can reset password`
        + Create a password reset token for a user (consider doing this in testing setup) and save to database
        + Call the endpoint with the token and new password
        + Make sure the `sendEmail` method on the `EmailService` was called
        + Expect the users password to be changed
      + `User with invalid token gets 400 error`
        + Call the endpoint with an invalid and new password
        + Expect a 400 response
  + Implement both routes and get all tests passing.
+ Stage 7 - Testing a Mocked `EmailService`
  + Add empty methods on the `EmailService` for `sendPasswordResetConfirmationEmail` and `sendPasswordResetEmail`
  + In the `email.test.js` file
    + Create a `mockSuccessResponse` and `mockFailureResponse` to simulate different responses for `sendEmail`
    + Use `jest` to create a `mockSendEmail` function 
      + It should pass a callback function to `jest.fn().mockImplementation`
      + That callback should accept an email object and return the `mockFailureResponse` if the object is missing the `to` property. It should return the `mockSuccessResponse` otherwise.
    + Use `jest` to mock `nodemailer`
      + Have it be an object with the `createTransport` property set to `jest.fn().mockImplementation`
      + Attach the `mockSendEmail` function to the `createTransport` mock
    + Update tests that call the `sendEmail` method to first create a new instance of the `EmailService` where it **IS** active and make sure the tests still pass
    + Add a describe block for `Sending password reset emails`
      + Test `sendPasswordResetEmail sends an email to provided user`
        + It should create a new link based on the token passed to it and call the `sendEmail` method to send an email to that user containing the link 
      + Test `sendPasswordResetConfirmationEmail sends a confirmation email to provided user`
        + It should send an email to the user letting them know their password has been changed.
  + Update `config.js` and `.env` files, and the `EmailService` constructor
    + Create the `EMAIL_FROM_ADDRESS`, `APPLICATION_NAME`, and `CLIENT_URL` env vars
    + Add them all to config and export them
    + Update the `EmailService` constructor to accept those as part of the config object and attach them to the instance
    + Modify all instances of `EmailService` to use the proper config
  + Add methods to `EmailService`
    + The `constructPasswordResetUrl` method should take in a token and contstruct the proper url using the `CLIENT_URL` and token.
    + The `sendPasswordResetEmail` should send an email using the link from the `constructPasswordResetUrl` method, the `EMAIL_FROM_ADDRESS`, and the `APPLICATION_NAME`
    + The `sendPasswordResetConfirmationEmail` should send an email using the `EMAIL_FROM_ADDRESS` and `APPLICATION_NAME`
  + Get all tests passing
+ Stage 8 - Add frontend components
  + Create a `Recover` component that is rendered for the `/recover` route in the app.
    + Make sure there is a "forgot your password?" link in the `Login` component that links here
    + That component should have an input for `email` and make a `POST` request to `/auth/recover` with the email. It should display the message returned by the server when it recieves it.
  + Create a `PasswordReset` component that is rendered for the `/password-reset` route in the app
    + It should use `react-router-dom`'s `useLocation` hook to get information about the current url
    + It should pass the `search` params to a new `URLSearchParams` and get the token in the url
    + It should have a custom hook called `usePasswordReset` form that accepts the token found in the url
      + That hook should manage two inputs - `password` and `confirmPassword`
      + The hook should submit the new password to the `/auth/password-reset` endpoint along with the token
    + It should render the response from the server, and redirect the user to the login page when their password has been successfully reset.
  + Add two new methods to the `ApiClient` class to handle making HTTP requests to both endpoints
+ Stage 9 - Add Info to SendGrid and Test App
  + Head to SendGrid and verify a sender address by entering in your information
  + Follow the protocols `SendGrid` asks for and replace the `EMAIL_FROM_ADDRESS` address with the one `SendGrid` verifies
  + Test that password reset functionality works as expected

## Stretch Goals
+ Implement account verification
  + Add the `account_verified` and `account_verification_token` columns to the database
  + Create a `generateVerificationToken` method in the `utils/tokens.js` file
    + Use it to generate a token for acccount verification
  + When users sign up successfully, make sure to use the email service send them a confirmation email with a valid verification token and link
  + Define a `verify` endpoint that extracts the users token from the route query parameters and passes it to a `verifyUserAccount` method on the `User` model
  + Define a `resendVerification` endpoint that resends a verify account email
  + Create a `VerifyAccount` component
    + Create a `useVerifyAccount` custom hook that extracts the token from query parameters and calls the appropriate endpoint when the user clicks a button to confirm
