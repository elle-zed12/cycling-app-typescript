import React from "react"

class AddRide extends React.Component <{ctr : any}> {
    constructor(props:any) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
      }

    handleSubmit(e:any) {  
        //e.preventDefault()
        
        let date : string = (document.getElementById("date") as HTMLInputElement).value
        let startTime : string = (document.getElementById("start-time") as HTMLInputElement).value
        let finishTime : string = (document.getElementById("finish-time") as HTMLInputElement).value
        let startLocation : string = (document.getElementById("start-location") as HTMLInputElement).value
        let finishLocation : string = (document.getElementById("finish-location") as HTMLInputElement).value
        let distance  = (document.getElementById("distance") as HTMLInputElement).value
        if (date !== '' && startTime !== '' && finishTime !== '' && startLocation !== ''
         && finishLocation  !== '' && distance !== '') {
          this.props.ctr.addRide(date, startTime, finishTime, startLocation, finishLocation, distance)
        }
      }

  render() {
    return(
    <section id="add-ride">
    <h2>Add a ride</h2>
    <form onSubmit={this.handleSubmit}>
    <label className="add-ride">Date</label>
        <input type="date" id="date" placeholder="Input the date"/>
        <label className="add-ride">Start time</label>
        <input type="time" id="start-time" placeholder="Start time"/>
        <label className="add-ride">Finish time</label>
        <input type="time" id="finish-time" placeholder="Inut the finish time" />
        <label className="add-ride">Start location</label>
        <input type="text" id="start-location" placeholder="Inut the start location" />
        <label className="add-ride">Finish location</label>
        <input type="text" id="finish-location" placeholder="Inut the finish location" />
        <label className="add-ride">Distance</label>
        <input type="number" id="distance" placeholder="Inut the distance" />
        <button type="submit">Add</button>   
    </form>
    </section>
    )
  }
}

export default AddRide