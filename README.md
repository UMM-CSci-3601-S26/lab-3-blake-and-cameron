[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/CLg4_p80)
# CSCI 3601 Lab 3 - Fullstack Development <!-- omit in toc -->

- [Setup](#setup)
  - [Make sure you have Mongo running on your (lab) computer](#make-sure-you-have-mongo-running-on-your-lab-computer)
  - [Open the project in VS Code](#open-the-project-in-vs-code)
  - [Installing the client dependencies](#installing-the-client-dependencies)
  - [Seeding the Database](#seeding-the-database)
- [Running your project](#running-your-project)
  - [MongoDB in VS Code](#mongodb-in-vs-code)
- [Testing and Continuous Integration](#testing-and-continuous-integration)
  - [Testing the client](#testing-the-client)
  - [Linting the client](#linting-the-client)
  - [Testing the server](#testing-the-server)
  - [End-to-end testing](#end-to-end-testing)
  - [GitHub Actions](#github-actions)
- [Selected Resources](#selected-resources)

This is your starter code for Lab 3 on Fullstack Development. The main goal here, as
described in [LABTASKS](./LABTASKS.md), is to explore and implement client-side or frontend aspects of the client/server architecture as part of a _fullstack_ project (_Fullstack_ is just a fancy way of saying you will developing both the frontend and the backend aspects of the project, as well as testing that the frontend and backend are working together).
You'll also add functionality to support things
like adding new todos; this will require making changes all the
way through from the Angular client, through the Java(lin) server,
to the MongoDB database.

## Setup

As in the previous labs, you'll be using VS Code (and GitKraken or the git/source control tools built in to VS Code). Once you've all joined your
group using GitHub classroom, you can clone your repository using your tools of choice.

As a reminder, **here are the steps needed to _run_ the project**:

1. Go into the `database` directory and enter `./mongoseed.sh` to run the script that will seed the database.
2. Go into the `server` directory and enter `./gradlew run` to run your server.
3. (If this is the first time you are running the client on this machine, in a _different_ terminal window from the server that is running, go into the `client` directory and enter `npm install` to install the client dependencies. This only needs to be done once per local clone of the repo. Running `npm install` may take several minutes the first time since it has to download all the dependencies. This step generates a `node_modules` directory in the `client` directory that contains all the installed dependencies.)
4. In a _different_ terminal window from the server that is running, go into the `client` directory and enter `ng serve` to make the client available.
5. You can then go to [`localhost:4200`](http://localhost:4200) in your favorite web browser and see
   your nifty Angular app.

### Make sure you have Mongo running on your (lab) computer

For all of this to work, it's critical that you have Mongo installed
and working. We should have that running on all the lab computers
(although it's good to confirm that). If you also want to do
development on your own computer you'll need to make sure you
have [MongoDB Community Edition](https://www.mongodb.com/docs/v7.0/tutorial/) and the [Mongo Shell](https://www.mongodb.com/try/download/shell) installed. If you're unsure if it's set up and
working correctly, try running `mongosh`. Make sure that you also have the MongoDB Command Line Database Tools installed (which used to be included in the MongoDB installation but are now separate) and that all of the appropriate binary files are added to your PATH variable. You can find [the MongoDB Command Line Database Tools here](https://www.mongodb.com/try/download/database-tools). It's possible that this setup will be different depending upon your operating system, so you may need to do some research on how to set up MongoDB and the Mongo Shell on your specific OS. If you have any issues with this, please ask your instructor or TA for help (outside of lab time).

If your MongoDB server isn't installed you'll likely get an error
message like:

```text
Error: couldn't connect to server 127.0.0.1:27017, connection attempt failed: SocketException: Error connecting to 127.0.0.1:27017 :: caused by :: Connection refused :
```

Or, you might simply get a message saying the command can't be found. If everything's good you should get something like this:

```text

Current Mongosh Log ID: 67a47dc2c810acdbd78b945c
connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8
Using MongoDB: 7.0.16
Using Mongosh: 2.3.8
```

Type `exit` or `^D` to exit out of the `mongo` shell tool.

> :warning: For various reasons we're running a slightly
older version of Mongo in the lab (v7, when the current version
is v8). This generally won't affect things, but there may be features that
v7 doesn't support. If you're trying something you found online
and it doesn't seem to work as advertised, you might check and
see if it's a v8 feature.
>
> When looking things up in the MongoDB docs, it's probably wise
to use [the v7.0 documentation](https://www.mongodb.com/docs/v7.0/).
>

### Open the project in VS Code

Launch Visual Studio Code, and then choose `File -> Open Folder…`. Navigate to your clone
of the repo and choose `Open`.

You may see a dialog that looks like this if you don't already have the recommended extensions:

![Dialog suggesting installation of recommended extensions](https://user-images.githubusercontent.com/1300395/72710961-bf767500-3b2d-11ea-8ea4-fbbd39c78da5.png)

Don't worry if you don't get the dialog, it is probably because you already have them all installed.

Like in previous labs, click "Install All" to automatically install them.

### Installing the client dependencies

Before you start working you will need to install the dependencies for the client.

1. Move into the `client` directory (`cd client`)
2. Run `npm install`. This only needs to be done once per local clone of the repo. Running `npm install` may take several minutes the first time since it has to download all the dependencies. This step generates a `node_modules` directory in the `client` directory that contains all the installed dependencies. There may be some warnings about vulnerabilities during the install process; these are generally safe to ignore unless they are errors. You may also be able to fix them later by running `npm audit fix` in the `client` directory.

### Seeding the Database

To give yourself some data to work with instead of starting with an empty database in our development environment, you need to 'seed' the database with some starter data. Seed data and the seed script are stored in the top level directory `database`. To seed the database, move into that directory and run `./mongoseed.sh` (on Mac/Linux) or `./mongoseed.bat` (on Windows). This will take each of the JSON files in `database/seed/` and insert their elements into the `dev` database.

:warning: Shell scripts (.sh) will not run on Windows machines, and Batch scripts (.bat) will not run on Unix-like machines. Be sure that you are running the correct script for your operating system.

These scripts also drop the database before seeding it so it is clean. You should run this after first cloning the project and again anytime you want to reset the database or you add new seed data to the `database/seed/` directory.

:warning: Our E2E tests also reseed the `dev` database
whenever you run them to ensure that those tests happen in a predictable
state, so be prepared for that.

## Running your project

The **run** Gradle task (`./gradlew run` in the `server` directory) will still run your Javalin
server, which is available at [`localhost:4567`](http://localhost:4567). The **build** task
will _build_ the server (including running Checkstyle and the tests), but not run it.

Once you have successfully run `npm install`, in order to serve up the _client side_ of your project, you will run
`ng serve` (from the `client` directory as well). The client will be available by default at [`localhost:4200`](http://localhost:4200). If your server is running, you will be able to see data for users if you navigate to the right place in the project.

For the most part, you will be using a local installation of Mongo as a `dev` (development) database. You don't really need to worry about how this is set up, but you do need to know a couple of tricks to help you use it
effectively.

### MongoDB in VS Code

We have included the [MongoDB for VS Code](https://marketplace.visualstudio.com/items?itemName=mongodb.mongodb-vscode) in the recommended extensions. This extension allows you to view and edit things in the Mongo database.

<details>
<summary>Expand for setup instructions</summary>

When installed you will see a new icon in the sidebar, click it and click "Add Connection".

![Screenshot of the Mongo Extension pane](https://user-images.githubusercontent.com/1300395/109005040-1f174c00-766f-11eb-85fb-0de47b22e4ae.png)

That will open a new tab with some options. Click "Open form" under "Advanced Connection Settings"

![image](https://user-images.githubusercontent.com/1300395/109006193-6c47ed80-7670-11eb-8b28-a740f9088d4f.png)

You can leave all the default settings and click the green "Connect" button to add the connection.

![image](https://user-images.githubusercontent.com/1300395/109006728-fabc6f00-7670-11eb-9f15-55a39f7b9674.png)

You will then have the MongoDB server in the sidebar.

</details>

You can explore the databases and collections here. You can click a record to view and edit it.

![Screenshot of displaying the users in the sample MongoDB database in VS Code](https://user-images.githubusercontent.com/1300395/109005447-91882c00-766f-11eb-994e-9a326deee21b.png)

You can also create a MongoDB _Playground_ in VSCode, which allows you to experiment with
queries in a more interactive way than is possible when you're working with your Java code.
Once you have a query working the way you want it, you can then export the query in different
programming languages, include Java.

## Testing and Continuous Integration

You have the ability to test the
client (component testing with Karma), the server (JUnit testing and Mockito), or both (E2E testing).

### Testing the client

From the `client` directory:

- `ng test` runs the client tests
  - This will pop up a Chrome window with the results of the tests.
  - This will run "forever", updating both in your terminal and in the Chrome
    window that gets generated. Typing CTRL-C in the terminal window will end
    the `ng test` process and close the generated Chrome window.
  - You can add `ng test --no-watch` if you just want to run the tests once
    instead of going into the "run forever" mode.
- `ng test --code-coverage` runs the client tests and generates a coverage report
  - It generates a coverage report you can find in your client directory `client/coverage/client/index.html`.
  - Right click on `index.html` and select `Copy path` and paste it into your browser of choice. You can also drag and drop `index.html` onto the tab area of your browser and it will open it.

### Linting the client

We have included a tool called ESLint which helps analyze the client
TypeScript and template HTML code and catch various errors and concerns. You will most likely see it directly in VS Code as yellow and red underlines. You can also directly run the linter on the entire client by running `ng lint` in the terminal in the `client` directory. This will check the whole client project and tell you if there are any issues.

### Testing the server

From the `server` directory:

- `./gradlew test` runs the server tests once.
  - It generates a report you can find in `server/build/reports/tests/test/index.html`.
- `./gradlew test jacocoTestReport` runs the server tests once and creates a coverage report
  - It generates a coverage report you can find in `server/build/jacocoHtml/index.html` in addition to the regular report generated by the `test` task.
- `.gradlew check` runs the tests and the Checkstyle checks
  - This is useful to avoid having annoying build fails on GitHub because Checkstyle didn't like
    your layout somewhere.

You might find it useful to be able to generate HTTP requests "by hand" and see what the output
is. The Thunder Client GitHub extension can be quite useful here; see [THUNDER_CLIENT.md](./THUNDER_CLIENT.md)
for more details and examples.

### End-to-end testing

End-to-end (E2E) testing involves the whole software stack rather than one part of it. Our E2E tests look at the behavior of both the client,
the server, and the database, and how they interact by simulating how a real user would interact with the app.

We use [Cypress](https://www.cypress.io/) for our end-to-end tests. There are a few ways to run the E2E tests. They are all started from the `client` directory and require the server be running at the same time (`./gradlew run` in the `server` directory).

- `ng e2e` both builds and serves the client and runs through all the Cypress end-to-end tests once.
- `ng e2e --watch` builds and serves the client but just opens Cypress for you to be able to run the tests you want without closing automatically.
  - This is the same as running `ng serve` and `npm run cy:open` (or `npx cypress open`) at the
    same time. If you are already running `ng serve` it will be easier to run `npx cypress open`
    rather than closing your `ng serve`, running `ng e2e`, and restarting `ng serve`.

:warning: The Cypress screenshots below are a little out of date, but you should get the idea.

The main page of Cypress looks something like this:

![image](https://user-images.githubusercontent.com/1300395/109009410-22f99d00-7674-11eb-9469-dd6a09710813.png)

You can click on any of the integration test files to run their tests or run them all. When you run a set of tests you will see something like this:

![image](https://user-images.githubusercontent.com/1300395/109009528-3f95d500-7674-11eb-86ee-8c5e375d5d0b.png)

There are a lot of neat things you can do here like inspect each test and find which selectors to use in the tests you are writing. We encourage you to look through some of the Cypress documentation linked in the "Selected Resources" section below or in the [Resources](./RESOURCES.md) markdown file.

### GitHub Actions

There are three GitHub Actions workflows set up in your repo:

- [Server Java](../../actions/workflows/server.yml) - JUnit tests for the server (`gradle-build`)
- [Client Angular](../../actions/workflows/client.yaml) - Karma tests (`ng-test`) and ESLint linting (`ng-lint`) for the client
- [End to End](../../actions/workflows/e2e.yaml) - Cypress tests for end-to-end testing (`ng-e2e`)

## Selected Resources

We have a much longer list of links in [Resources](./RESOURCES.md), but here are a few I think you'll find especially helpful since they relate to new things or things that were not well documented in the previous lab:

- [Our basic notes about GitHub Projects](./GITHUB_PROJECTS.md)
- [Angular Unit Testing (Karma)](https://angular.dev/guide/testing)
- [Angular Forms](https://angular.dev/guide/forms)
- [Angular Material](https://material.angular.io/)
- [Theming Angular Material](https://material.angular.io/guide/theming)
- [Cypress Docs](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices.html)
