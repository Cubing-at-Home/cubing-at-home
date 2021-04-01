import { LinearProgress } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
import Schedule from "../Competition/Schedule";
import TabPanel from "../TabPanel";
import BackyardInfo from './BackyardInfo';


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const tabs = {
  information: 0,
  schedule: 1,
  competitors: 2,
  compete: 3,
  results: 4,
  faq: 5,
  discord: 6,
};

export default function BackyardCubing({ history, match }) {
  const theme = useTheme();
  const [competitionInfo, setCompetitionInfo] = React.useState({
name: 'Cubing In Your Backyard',
    id: "backyardcubing",
    eventList: [
      "333ft",
      "333fm",
      "pyram",
      "444",
      "555",
      "222",
      "777",
      "333oh",
      "fto",
    ],
    start: "2021-04-01",
    end: "2021-04-01",
    competitorCount: -1,
    rounds: [],
    schedule: [
      {
        id: "333ft",
        name: "3x3 Feet Backyard Finals",
        start: "12:00",
        end: "13:00",
        qualification: "",
      },
      {
        id: "fto",
        name: "FTO Backyard Final",
        start: "13:00",
        end: "13:10",
        qualification: "",
      },
      {
        id: "skewb",
        name: "Skewb Backyard Final",
        start: "13:10",
        end: "13:30",
        qualification: "",
      },
      {
        id: "mirror",
        name: "Mirror Blocks Backyard Final",
        start: "13:30",
        end: "13:50",
        qualification: "",
      },
      {
        id: "twitch",
        name: "Happy April Fools Backyard Final",
        start: "13:50",
        end: "14:10",
        qualification: "",
      },
    ],
  });
  const classes = useStyles();

  const [value, setValue] = React.useState(match.params.tab || "information");

  const handleChange = (event, newValue) => {
    // history.push(`/backyardcubing/${event.target.innerText.toLowerCase()}`)
    setValue(event.target.innerText.toLowerCase());
  };

  return (
    <div className={classes.root}>
      {!competitionInfo ? (
        <LinearProgress />
      ) : (
        <>
          <AppBar color="inherit" position="static">
            <Tabs
              scrollButtons="on"
              variant="scrollable"
              value={tabs[value]}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Information" {...a11yProps(0)} />
              <Tab label="Schedule" {...a11yProps(1)} />
              {/* <Tab label="Competitors" {...a11yProps(2)} /> */}
              <Tab label="Compete" {...a11yProps(3)} />
              <Tab label="Results" {...a11yProps(4)} />
              <Tab label="FAQ" {...a11yProps(5)} />
              <Tab label="Discord" {...a11yProps(6)} />
            </Tabs>
          </AppBar>
          <TabPanel value={tabs[value]} index={0}>
            <BackyardInfo history={history} match={match} competitionInfo={competitionInfo}/>
          </TabPanel>
          <TabPanel value={tabs[value]} index={1}>
            <Schedule competitionInfo={competitionInfo} />
          </TabPanel>
  
          <TabPanel value={tabs[value]} index={3}>
            {() =>
              window.location.replace(
                `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
              )
            }
          </TabPanel>
          <TabPanel value={tabs[value]} index={4}>
            {() =>
              window.location.replace(
                `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
              )
            }
          </TabPanel>
          <TabPanel value={tabs[value]} index={5}></TabPanel>
          <TabPanel value={tabs[value]} index={6}>
            <iframe
              title="discord"
              src="https://discordapp.com/widget?id=690084292323311720&theme=dark"
              width="1000vw"
              height="500vh"
              allowtransparency="true"
              frameborder="0"
            ></iframe>
          </TabPanel>
        </>
      )}
    </div>
  );
}
