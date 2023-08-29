<h1 align="center">PodzNetwork</h1>

<h3 align="center">Environmental variables</h3>

Environmental variables in this project include:

-   `MONGODB_URI` The MongoDB Connection String (with credentials and database name)
-   `NEXT_PUBLIC_WEB_URI` The _URL_ of your web app.
-   `CLOUDINARY_URL` (optional, Cloudinary **only**) Cloudinary environment variable for configuration. See [this](https://cloudinary.com/documentation/node_integration#configuration).
-   `NODEMAILER_CONFIG` (optional, if using nodemailer **only**) JSON stringified nodemailer config. eg. `{"service":"Gmail","auth":{"user":"test@gmail.com","pass":"aHR0cHM6Ly95b3V0dS5iZS9kUXc0dzlXZ1hjUQ=="}}`
<details>
    <summary><b>Social Media Keys</b></summary>
    <h4>Twitter</h4>
-   Go to https://developer.twitter.com/en/portal/dashboard. and create a new app. <br>
-   Go to settings and setup user authentication and click Edit. In the app info, set the callback URL / Redirect URL as following: [WebURL]/auth/api/twitter <br>
-   Go to keys and tokens and to the OAuth 2.0 Client ID and Client Secret Section: <br>
-   Add the environment variables as follows: <br>
-   <b>NEXT_PUBLIC_TWITTER_CLIENT_ID</b> Paste the Client ID. <br>
-   <b>TWITTER_SECRET_KEY</b> Paste the Client Secret. <br>

<h4>Facebook</h4>
-   Go to https://developers.facebook.com/, sign up and create a new app. <br>
-   In the left sidebar click add product and then add Facebook Login. <br>
-   Add the environment variables as follows: <br>
- <b>NEXT_PUBLIC_FACEBOOK_APP_ID</b> Paste the App ID.

<h4>Instagram</h4>
-   Go to https://developers.facebook.com/, sign up and create a new app. <br>
-   In the left sidebar click add product and then add Instagram Basic Display. <br>
-   Go to Basic Display in Instagram Basic Display from the left sidebar. <br>
-   In client OAuth Settings, in the Valid OAuth Redirect URLS, add the following: [WebURL]/auth/api/instagram <br>
-   Add the environment variables as follows: <br>
-   <b>NEXT_PUBLIC_INSTAGRAM_CLIENT_ID</b> Paste the Instagram App ID <br>
-   <b>INSTAGRAM_SECRET_KEY </b> Paste the Instagram App Secret <br>

</details>

<h3 align="center">Development</h3>

Start the development server by running `yarn dev` or `npm run dev`. Getting started by create a `.env.local` file with the above variables. See [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables).

<h2 align="center">Deployment</h2>

This project is deployed on Vercel. Make sure to set the environment variables using the options provided by your cloud/hosting providers.

After building using `npm run build`, simply start the server using `npm run start`.

You can also deploy this with serverless providers given the correct setup.

# Test Database:

We don't have any test database but once you run the application locally, admin username and password is automatically seeded and you can login with those credentials. You can sign-up as a user or invite an editor.
These are some of the RSS links that can be added to the platform for testing purposes:

-   https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/2b18f6f0-09c0-471e-b663-aeed010410fa/da6eda02-def2-4de4-a1c2-aeed010456a1/podcast.rss
-   https://feeds.npr.org/510289/podcast.xml
-   https://feeds.megaphone.fm/marketingagainstthegrain
-   https://feeds.buzzsprout.com/1384534.rss
-   https://anchor.fm/s/71d03718/podcast/rss
