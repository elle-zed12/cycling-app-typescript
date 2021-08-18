import React from "react";
import "style/App.css";
import DisplayRide from "components/History/DisplayRide";

//Mapping the objects inside the ride history record array to acces the rides attributes
class RideRecord extends React.Component<{ ctr: any }> {
  render() {
    let rides = this.props.ctr.getAllRides();
    return (
      <ul id="ride-history">
        <h2>Ride History</h2>
        {rides.map(
          (ride: {
            id: any,
            title: any,
            startTime: any,
            date: any,
            finishTime: any,
            startLocation: any,
            finishLocation: any,
            duration: any,
            speed: any,
            distance: any,
          }) => (
            <DisplayRide
              key={ride.id}
              title={ride.title}
              startTime={ride.startTime.toLocaleTimeString()}
              date={ride.startTime.toLocaleDateString()}
              finishTime={ride.finishTime.toLocaleTimeString()}
              startLocation={ride.startLocation}
              finishLocation={ride.finishLocation}
              duration={ride.duration}
              speed={ride.speed}
              distance={ride.distance}
            />
          )
        )}
      </ul>
    );
  }
}

export default RideRecord;
