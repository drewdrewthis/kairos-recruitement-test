# Lib Directory - NextJS Application

The `lib` directory is a crucial part of our NextJS application architecture. It is designed to hold reusable libraries and utilities that are fundamental to the core functionality of our NextJS app.

This application utilizes the new app router, providing a powerful, flexible, and scalable solution for managing routes within the application.

## Structure

The `lib` directory typically contains the following:

```
/lib
  /api
  /auth
  /hooks
  /router
  /utils
```

## Contents

### /api

This is where the API clients are defined. We use these clients to communicate with our backend services.

### /auth

The authentication logic of our app is encapsulated here. It handles the users' sign-in, sign-out, password reset, authorization, and related features.

### /hooks

This directory contains custom React hooks. These hooks are reusable pieces of the code that are used across different components of our application.

### /router

This directory encapsulates the routing logic using the new app router. It includes route definitions, route guards, and other routing utilities.

### /utils

This directory contains various utility functions and classes that are used throughout the application. This includes date formatting, string manipulation, data validations, etc.

## Usage

All files and modules in this directory are exported using ES6 export syntax, and can be imported anywhere in your Next.js application.

```javascript
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/utils/date-utils";
```

Please ensure that you import these utilities correctly to avoid any runtime errors.
