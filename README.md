# Backend for Stellar Burger project

This API is intended for the React Burger frontend application. Previously, the frontend for this application was developed for educational purposes. In this same project, a backend has been implemented for this application.

## Description

### HTTP Routes:

In the docs folder, you can find the openapi.yaml file. It provides you with detailed documentation for HTTP requests that you can import into [Postman](https://www.postman.com/) or [Swagger](https://editor.swagger.io/).

`/ingredients`

**METHOD:** GET

This route is intended for retrieving ingredients. An unchangeable list of ingredients (15 items) is stored in the database. Upon request, the server sends this list to the client.

`/auth/register`

**METHOD:** POST

This route is designed for user registration in the database. It accepts parameters: name, email, password. Upon user creation, the password is hashed and stored in the database. Additionally, an accessToken and a refreshToken are generated. The server sends an object to the client, containing fields: accessToken, refreshToken, success (request status), and a field with the user object. The user object contains email and name fields.

`/auth/login`

**METHOD:** POST

This route is intended for users to log into their account using their email and password. Upon successful login, an accessToken and refreshToken are generated. The server sends an object to the client, containing fields: accessToken, refreshToken, success (request status), and a field with the user object. The user object contains email and name fields.

`/auth/user`

**METHODS:** GET, PATCH

When using the **GET** method, this route is used to retrieve user information. This route has a middleware that checks if the user is authorized, as only authorized users can access this information. Token verification is used for this purpose. The user is searched for in the database based on their ID. Upon successful identification, the client receives a response in the form of an object with success and user fields. The user object includes email and name fields.

When using the **PATCH** method, this route is used for users to update their own data (email, name, password) in their personal account. This route also has a middleware that checks if the user is authorized, as only authorized users can update their information. Token verification is used for this purpose. After successful update, the client receives a response in the form of an object with success and user fields. The user object includes email and name fields.

`/auth/logout`

**METHOD:** POST

This route is used for user logout. Upon successful logout, the client receives an object with fields: message: "Successful logout" and success: true.

`/password-reset`

**METHOD:** POST

This route is used for sending password reset requests. The scheme is as follows: the client sends a request to the server with an **email.** After receiving the request, the server sends a code to the specified email, which must be entered to create a new password on the password change page (it will open after sending). Since the project is done for educational purposes, a fake SMTP service Ethereal is used. When the server is running on the computer, a temporary password and login for Ethereal are displayed in the console.
You must enter them on the [website](https://ethereal.email/) to log into  account and view the code sent in the email.

`/password-reset/reset`

**METHOD:** POST

This route is used for the direct setting of a new password. The client sends a request, in the body of which they include **the new password** and **the code** from the email. The controller accepts this information, creates a new hashed password for the respective user, and removes the field containing the password reset code.

`/password-reset/reset`

**METHOD:** POST

This route is used to ensure that the user does not get logged out of their account after the access token's expiration. Upon access token expiry, the client should use the refresh token to obtain a new access token. After a successful request, the server sends an object to the client containing the fields accessToken and refreshToken. The response also includes a success field indicating the successful refresh.

`/orders`

**METHOD:** POST

This route provides authorized users with the ability to create orders in their accounts. In the app, users choose the bun and fillings for the burger and send an array of ingredient IDs to the server. After that, an order is created on the server.

### Websocket Routes:

`/orders`

Retrieves orders of a specific user. User should be authorized. This route provides real-time updates on orders and their statuses.

`/orders/all`

Retrieves orders of all users. This route provides real-time updates on orders and their statuses. The latest 50 orders are being loaded.

## Stack

- **Language**: TypeScript
- **Backend**: Node.js, Express, WebSocket
- **Database**: MongoDB, Mongoose
- **Task Scheduling**: Agenda
- **Email Service**: Nodemailer
- **Validation**: Joi, Celebrate
- **Logging**: Winston, express-winston
- **Authentication**: bcrypt, jsonwebtoken
- **Utilities**: uuid, validator, cookie-parser
- **Environment Variables**: dotenv
- **Documentation**: openapi.yaml

## Project Setup

Node.js, MongoDB must be installed. Then, execute the following commands

```sh
npm i
```

```sh
npm run start
```

If you need to setup in Hot Reload mode,  execute the following command:

```sh
npm run dev
```
