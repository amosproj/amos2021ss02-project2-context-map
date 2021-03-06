# Amazing AMOS Hello World Project

First, make sure you have [nodejs](https://nodejs.org/) installed.

This project was created via `npx create-react-app hello-world-app --template typescript` in the git root folder and slightly modified.

## Available Scripts

In the project directory (`amos-ss2021-project2-context-map/frontend/`), the following commands are helpful:

### `yarn install`

Installs all required dependencies, so that further commands will work.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Testing
1. start react with `yarn run start:forTests` in package.json.
2. open cypress with `yarn run cy:open:e2e` or `yarn run cy:run:e2e`.
3. if `yarn run cy:open:e2e` was used, start all tests manually.
4. print testing-coverage with `yarn run coverage:print`.

### `yarn run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Environment Variables
Be sure to create a `.env` file in this directory.
Important but private information like the database connection settings can be stored here.
An example can be found in the `.env.example` file.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
