# Deploy Your Application

We're going to use Heroku to deploy our backend and Surge to deploy our frontend! Before you continue, make sure you have two folders, each with their own git repository.

Your folder structure might look something like this:

```bash
express-api
react-ui
```

It's important to have this structure because we need two different deployments, one for the front-end and one for the backend.

## Backend

Make sure you are running the following commands in the `express-api` directory for your project.

Replace `NAME_OF_APP` with whatever you decide to name your application.

```bash
heroku login
heroku create NAME_OF_APP
```

Take note of the url that was just created for your new application.

Then run these commands, again making sure to replace `NAME_OF_APP` with whatever you decide to name your application.

```bash
echo "web: node server.js" > Procfile
heroku git:remote -a NAME_OF_APP
git add .
git commit -m "Deploying express api"
```

This commands will create a web application and the `Procfile` which tells Heroku what command to run to start the server.

Now that you have a remote named, run the following commands in the same directory. We're going to push our code to Heroku and spin up a new postgres database instance for our app.

```bash
git push heroku master
heroku addons:create heroku-postgresql:hobby-dev -a NAME_OF_APP
```

This will create a `DATABASE_URL` variable for us that we can then use in the next command. Now we'll go ahead and copy our local database to the production one so that we can have our seed data in production.

Replace `DATABASE_NAME` with the name of your database and `NAME_OF_APP` with whatever you decide to name your application. Leave `DATABASE_URL` as the exact text `DATABASE_URL`.

```bash
heroku pg:push DATABASE_NAME DATABASE_URL -a NAME_OF_APP
heroku open
```

If you are getting any errors, run `heroku logs -t -a NAME_OF_APP` to attempt to debug them.

We'll need to set some environment variables as well, since our `.env` file isn't commited to git.

See what environment variables are currently present by running `heroku config`.

Then, go ahead and set one that we know for sure:

```bash
heroku config:set EMAIL_SERVICE_STATUS=active
```

That should update the `EMAIL_SERVICE_STATUS` to `active` so that our application can send emails. Run `heroku config` again to make sure it's working as expected.

Let's handle one more environment variable update to get our database connection working.

```bash
heroku config:set PGSSLMODE=no-verify
```

All Heroku Postgres production databases require using SSL connections to ensure that communications between applications and the database remain secure, so we're ensuring that our postgres instance doesn't reject our database connection.

This update should now should our backend up and running as expected.

We'll come back to this in a bit so don't worry if we're still missing a few environment variables.

## Frontend

Let's now handle deploying our React app. To deploy this repo, we'll be using a tool called **Surge**, which is a very easy way to deploy static websites.

Make sure tha tyou have the `surge` command installed. You can run this command anywhere in the Terminal:

```bash
npm install --global surge
```

With the current working directory set to the frontend of your project, run the following commands, replacing `HEROKU_BACKEND_URL` with the url that heroku provided during the backend deploy process.

```bash
REACT_APP_REMOTE_HOST_URL=HEROKU_BACKEND_URL npm run build
cp build/index.html build/200.html
surge build
```

Choose your own domain or let Surge pick one for you.

Open the link provided and paste it into the browser to make sure things are working.

## Putting It All Together

Now that the frontend and backend are both deployed, make sure to add any remaining environment variables the backend depends on.

```bash
heroku config:set EMAIL_FROM_ADDRESS=YOUR_SENDGRID_EMAIL_FROM_ADDRESS
```

This should match up with your Twilio SendGrid configuration.

```bash
heroku config:set CLIENT_URL=YOUR_FRONTEND_URL
```

This will help when creating links for use by your email service. Make sure not to have a trailing slash on your frontend url.

```bash
heroku config:set SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
```

This should allow you to start sending emails with Twilio Sendgrid.

Now test your application and make sure everything is in order.
