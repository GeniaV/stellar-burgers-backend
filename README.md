# Backend for Stellar Burger project

## Description

`/password-reset`
This route is used for sending password reset requests. The scheme is as follows: the client sends a request to the server with an email. After receiving the request, the server sends a code to the specified email, which must be entered to create a new password on the password change page (it will open after sending). Since the project is done for educational purposes, a fake SMTP service Ethereal is used. When the server is running on the computer, a temporary password and login for Ethereal are displayed in the console.
You must enter them on the [website](https://ethereal.email/) to log into  account and view the code sent in the email.

## Stack

TypeScript, Node.js, Express, MongoDB, Mongoose, Nodemailer

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
