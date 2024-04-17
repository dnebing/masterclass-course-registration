# course-registrations React Custom Element Client Extension

Welcome to the course-registrations React Custom Element, built and deployed as a Client Extension (CX).

This is a React-based custom element which handles listing course registrations, has some navigation via React Router,
and leverages the picklist and custom object headless APIs. It also takes a configuration property (settable via the GUI)
to control whether an admin view is presented or not.

I started this CX using the following commands:

```bash
$ blade init -v portal-7.4-ga112 masterclass
$ cd masterclass/client-extensions
$ yarn create vite course-registrations --template react
```

That created the initial project here, and then I followed the instructions from my other blog post,
https://liferay.dev/blogs/-/blogs/from-react-app-to-react-client-extension-in-5-easy-steps to update the
project so it could build into a CX zip file.

The custom element is defined in main.jsx, and the application is defined in App.jsx.

It uses a few key components:

* main.jsx - Defines the main component and handles the React connect and disconnect.
* App - The main application component.
* TableComponent and AdminTableComponent - Displays the table of course registrations, one for regular users and one for admins.
* DetailComponent - Shows the details of an individual course registration.
* FormComponent - Shows the form to add/edit a course registration.
* Toolbar - Shows the toolbar for filtering and adding course registrations.
* ActionButtons and ActionButton - Handles the action buttons for the approval and denial of course registrations.

There are five key javascript files in use:

* api.js - Defines the api() function used to wrap invoking fetch for the Liferay Headless APIs.
* FilterAndSort.js - Defines methods for filtering and sorting the course data.
* liferay.js - Defines the Liferay object so React is happy during builds/testing but runtime will use the real Liferay JS object.
* stringToBoolean.js - Defines a function for returning a string as a boolean, allows some flexibility when handling the admin attribute.
* util.js - Returns the icon sprite map for the Clay framework.

From a React perspective, this app leverages the following:

* React v18
* React Router 6
* Clay

When this is in a Liferay Workspace in the client-extensions folder, you can do things like `../../gradlew build` to build the
distribution zip file, and if you have the bundle set up using `gradlew initBundle` (from the root of the workspace), you can
use `../../gradlew deploy` to rebuild and deploy the client extension into the bundle.

To distribute the CX to Liferay PaaS or Self-Hosted, build the distribution zip and deploy it directly to the `osgi/client-extensions` folder.
Do *not* drop the distribution zip file into the Liferay `deploy` folder as it will not deploy correctly.

To distribute the CX to Liferay SaaS, use the Liferay CLI tool to upload the CX and Liferay will take care of the rest.
