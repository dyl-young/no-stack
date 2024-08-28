## Running the applications

[Take me 🔙](../../README.md)

The monorepo will allow you to run the following applications alongside one another: expo, nextjs (which contains the backend for expo and a web frontend), the packages required by both and the supabase project.

1. Ensure that dependencies are installed `pnpm i`
2. Run the local server with `pnpm dev`
3. Open the following domains in your browser:
   - http://localhost:3000/ next.js application
   - http://localhost:54323/ local supabase console
   - http://localhost:54324/ local email server (emails from supabase are sent here)
4. You should also see the app open in your mobile device simulator

Any changes you make will refresh automatically.

### Nextjs

The application will automatically run when you run `pnpm dev`
The nextjs application is available at - http://localhost:3000/

To sign up for a new account:

1. Open the nextjs application at - http://localhost:3000/
2. Sign up with an email and password
3. You will need to verify your email address. You can do this using the Inbucket email server on http://127.0.0.1:54324/
4. Navigate to the Monitor tab and select the message from the list
5. Inside the message confirm the the email address of the recipient. Should be the email that you signed up with.
6. Click confirm email. This will open a new tab. You should be able to sign-in.

### Expo

Note that some use cases for no-stack will not require the expo application. For example, if you are only developing a web application. In that case you can simply delete the whole `/apps/expo` folder.

If you still need to expo application, but do not want it to run alongside the nextjs application, you can run

```bash
pnpm dev:without-expo
```

- Clicking on the simulator and then pressing cmd+r will refresh the application if you need to restart it

### tRPC API Explorer

The project includes an API UI panel that can be used to test tRPC procedures defined in the routers. To access this, navigate to http://localhost:3000/api/trpc/panel. The panel is only accessible in local development environments.

> Note: The session is shared between the Next app and the API explorer. You must be **logged into the Next app** to access protected routes.

#### Source: [trpc-ui](https://github.com/aidansunbury/trpc-ui)

### Setting up Reactotron devtools

With the new Hermes engine, ReactNative Devtools no longer work. If you want to debug your redux state, Reactotron is a fantastic (and currently it seems only) choice. It is already setup in the app, but you'll need to add Reactotron if you don't already have it:

#### Setup with Brew:

`brew install --cask reactotron`

#### [Reactotron Docs](https://docs.infinite.red/reactotron/)

## What's Next?

Now take a look at [LOCAL_DEVELOPMENT.md](../development/LOCAL_DEVELOPMENT.md) to see how to continue developing the applications.
