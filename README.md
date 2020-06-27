# Cubing At Home

Code that runs at https://cubingathome.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/a2c60302-aa00-46d4-bb75-d00974399e12/deploy-status)](https://app.netlify.com/sites/stupefied-golick-c358d7/deploys)

## Getting Started

If you want to test this project locally, clone the code and then run

```
cd src
yarn install
yarn start
```

For local testing, we use the Staging Server from WCA. You can log in as any of the [admins](https://github.com/saranshgrover/cubing-at-home/blob/master/src/logic/consts.js#L146) to access admin functionality. The username and password for staging are the WCA ID and 'wca'

We also use a local firestore database. So you are free to make any changes/additions in development, and it won't reflect on the website. If you absolutely need to test something with the production database, you can change it [here](https://github.com/saranshgrover/cubing-at-home/blob/master/src/utils/firebaseConfig.js).


## Built With

-   [React](https://www.reactjs.org)
-   [Material UI](https://www.material-ui.com)
-   [Firebase](https://firebase.google.com)

## Authors

-   **Saransh Grover** - [saranshgrover](https://saranshgrover.com)

## License

Software in this repository is under the `GNU General Public License v3.0` Read more about the license [here](https://github.com/saranshgrover/cubing-at-home/blob/master/LICENSE)

## Acknowledgments

Code for Attempt Results is from [WCA Live](https://github.com/thewca/wca-live)
