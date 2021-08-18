import React, { Component } from "react";
import "style/App.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "style/Tabs.css";
import "style/Collapsible.css";
import RideMode from "components/RideMode/RideMode";
import RideHistoryDisplay2 from "components/History/RideHistoryDisplay2";
import logo from "images/logo.png";

class MainPage extends React.Component<{ ctr: any }> {
  render() {
    return (
      <section>
        <header>
          <img src={logo} alt="logo" />
          <h1>iCycle</h1>
        </header>
        <Tabs defaultIndex={1}>
          <TabList>
            <Tab>Ride</Tab>
            <Tab>History</Tab>
            <Tab disabled>Goals</Tab>
          </TabList>
          <TabPanel>
            <RideMode ctr={this.props.ctr} />{" "}
          </TabPanel>
          <TabPanel>
            <RideHistoryDisplay2 ctr={this.props.ctr} />
          </TabPanel>
          <TabPanel>empty</TabPanel>
        </Tabs>
      </section>
    );
  }
}

class App extends Component<{ ctr: any }> {
  render() {
    return <MainPage ctr={this.props.ctr} />;
  }
}

export default App;
