
# prixa-diagnostic-web

This is a Prixa diagnostic engine web repository. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Before You Start
- Make sure `yarn`, `node` version `>= 10.13`, `redis`, [`gcp`](https://cloud.google.com/sdk/install),  and [`kubenertes`](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos) are installed
- Make sure you're [logged into your gcp via terminal](https://cloud.google.com/sdk/gcloud/reference/auth/login)
- Make sure you've cloned `prixa-db` and have it on `develop` branch
- Setup your `redis`
	- open terminal and run `redis-cli`
	- run `set partner:8f23ab4c-38ac-4c46-bb26-4b10e2aca959 "{\"id\":\"8f23ab4c-38ac-4c46-bb26-4b10e2aca959\",\"name\":\"Partner 12\",\"status\":\"ACTIVE\",\"appIds\":[],\"createdAt\":\"2020-02-05 12:18:07.269928 +0700 WIB m=+404.960420697\",\"updatedAt\":\"2020-02-05 12:18:07.269934 +0700 WIB m=+404.960427222\"}"`
	- run `set partner:8f23ab4c-38ac-4c46-bb26-4b10e2aca959:partner_app:be10ed1b-0240-4cc5-92ae-4a53da25e0ce "{\"id\":\"be10ed1b-0240-4cc5-92ae-4a53da25e0ce\",\"name\":\"Aplikasi 2\",\"status\":\"ACTIVE\",\"secretKey\":\"q1Sw111U4sXb8ew\",\"createdAt\":\"2020-03-04 13:17:24.137421 +0700 WIB m=+4084.319979083\",\"updatedAt\":\"2020-03-04 13:17:24.137452 +0700 WIB m=+4084.320010158\"}"`
	- terminate `redis-cli` and close the terminal

## How to Run `prixa-diagnostic-web` Locally
- Create `.env` file in `prixa-diagnostic-web` folder. Use code that are in `.env.example`. Use code mark as `NALAR` to use Nalar as your app environment. Use `COVID` if you wish to use Covid app environment
- Open terminal (make sure terminal is located in `prixa-diagnostic-web`) and run: `sh port-forwardScript.sh`. Use `sh port-forwardScript.sh covid` if you want to run it in Covid app environment
- In a new terminal (still located in `prixa-diagnostic-web`), run:
```sh
yarn install
yarn start
```
- Your app is up and running on [http://localhost:3000/?pId=8f23ab4c-38ac-4c46-bb26-4b10e2aca959&appId=be10ed1b-0240-4cc5-92ae-4a53da25e0ce](http://localhost:3000/?pId=8f23ab4c-38ac-4c46-bb26-4b10e2aca959&appId=be10ed1b-0240-4cc5-92ae-4a53da25e0ce) without backend services (need to run `prixa-db` locally to run it correctly)
- At this point, the page will reload if you make edits. You will also see any lint errors in the console.

## How to Run `prixa-db` Locally
- make sure you run `redis-server` in your terminal
- make sure you have a `.env` file in `prixa-db` (please ask the developer)
- open terminal (make sure it's located in `prixa-db`) and run `go mod download && go run cmd/nalar/main.go`

  

## Available Scripts
In the project directory, you can run:

### `yarn start`
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

### `yarn start:covid`
It's similar with  `yarn start` but you are using Covid app environment

### `yarn install`
Install node_modules and update packages in your app folder

### `yarn lint`
Run linter to analyses source code and flag programming errors, bugs, stylistic errors, and suspicious constructs. It also auto fix some stylistic errors.

### `yarn cy:open`
Opens the Cypress Test Runner

### `yarn cy:run`
Runs Cypress tests to completion. By default,  `cypress run`  will run all tests headlessly in the Electron browser.


## Learn More
You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn about cypress, checkout:
- [Cypress Docs](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file "https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file")  
- [Best Practice 1](https://docs.cypress.io/guides/references/best-practices.html "https://docs.cypress.io/guides/references/best-practices.html")  
- [Best Practice 2](https://ruleoftech.com/2019/notes-of-best-practices-for-writing-cypress-tests "https://ruleoftech.com/2019/notes-of-best-practices-for-writing-cypress-tests")  
- [Video](https://www.youtube.com/watch?v=5XQOK0v_YRE "https://www.youtube.com/watch?v=5XQOK0v_YRE") or learn form existing cypress test.

## Notes for developers
- please install [commitizen/cz-cli](https://github.com/commitizen/cz-cli) before you do any commit
- please add [gitlens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) to help you see any changes and previous commits in your vscode

## Credits
- [rheza@prixa.ai](mailto:rheza@prixa.ai)
- [myrtyl@prixa.ai](mailto:myrtyl@prixa.ai)
- [tenta@prixa.ai](mailto:tenta@prixa.ai)
- [patricia@prixa.ai](mailto:patricia@prixa.ai)
- [rian@prixa.ai](mailto:rian@prixa.ai)
- [alpredovandy@gmail.com](mailto:alpredovandy@gmail.com)