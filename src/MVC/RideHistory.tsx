import Ride from "MVC/Ride"

const STORAGE_KEY = 'cyclingApp';


//interfaces
interface FilterInterface {
    getRidesBySpeed(speed1: number, speed2: number): Array < any >
        getRidesByDuration(duration1: number, duration2: number): Array < any >
        getRidesByDistance(distance1: number, distance2: number): Array < any >
}

interface StorageInterface {
    save(arg: any): void
    load(arg: any): any
}

interface EditorInterface {
    startEditing(arg: any): void
    doneEditing(arg: any): void
    cancelEditing(arg: any): void
    removeRide(arg: any): void
}

interface SortInterface {
    sortByStartTime(arg: any): any
    sortByFinishTime(arg: any): any
    sortByDuration(arg: any): any
    sortByTitle(arg: any): any
    sortBySpeed(arg: any): any
}

interface SearchInterface {
    findRideByTitle(arg: any): any
    findRideByDate(arg: any): any
    findRideById(arg: any): any
}


//1.    Create a whole that acts as a Facade for parts
class RideHistory implements FilterInterface, StorageInterface, EditorInterface, SortInterface, SearchInterface {

    private allMyRides: Array < any >
        private beforeEditFromCache: string
    private beforeEditToCache: string
    private visibility: string

    public constructor() {
        this.allMyRides = []
        this.beforeEditFromCache = ''
        this.beforeEditToCache = ''
        this.visibility = 'all'
    }

    // FEATURE 2. Add a part
    public addRide(newStart: Date, newFinish: Date, newFrom: string, newTo: string, newDistance: number): any {
        newFrom = newFrom.trim()
        newTo = newTo.trim()
        //FEATURE 10. Validate inputs.
        try {
            if (!(newStart instanceof Date)) throw "Invalid start date"
            if (!(newFinish!instanceof Date)) throw "Invalid finish date"
            if (isNaN(newDistance)) throw "Invalid distance field"
            if (newDistance === null) throw "Empty distance field"
            if (newFrom === '') throw "Empty location from"
            if (newTo === '') throw "Empty location to"
        } catch (err) {
            return `Error! Try again:${err}`
        }
        // FEATURE 13. Provide default values, 
        let id = Math.max(...this.allMyRides.map(o => o.id), 0) // to avoid duplicate, check the max id + 1 for the new Id   
        const newId = id + 1
        let newStatus: boolean = true
        let aNewRide = new Ride(newId, newStatus, newStart, newFinish, newFrom, newTo, newDistance)
        this.allMyRides.push(aNewRide)
    }

    public getAllRides() { // FEATURE 15.	Get all parts
        return this.allMyRides
    }

    // FEATURE 4. Filter parts.
    public getRidesByDistance(distance1: number, distance2: number): Array < any > {
        return this.allMyRides.filter(function(ride) {
            return distance1 < ride.distance && ride.distance < distance2
        })
    }
    public getRidesByDuration(duration1: number, duration2: number): Array < any > {
        return this.allMyRides.filter(ride => duration1 < ride.duration && ride.duration < duration2)
    }
    public getRidesBySpeed(speed1: number, speed2: number): Array < any > {
        return this.allMyRides.filter(ride => speed1 < ride.speed && ride.speed < speed2)
    }

    public getRidesByStatus(completed: boolean): Array < any > {
        return this.allMyRides.filter(ride => ride.status === completed)
    }


    public filterByDate(fromThisDate: Date) {
        let result = this.getAllRides()
        let show = result.filter(result => result.startTime >= fromThisDate)
        this.visibility = "fromDateRequested"
        return show
    }

    //  FEATURE 6.	Save all parts to LocalStorage
    public save(): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.allMyRides))
    }
    // FEATURE 7. Load all parts from LocalStorage
    public load() {
        if (localStorage) {
            let savedArray = []
            let item = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            for (let object of item) {
                let aRide = new Ride(object.id, object.completed, new Date(object.startTime), new Date(object.finishTime), object.startLocation, object.finishLocation, object.distance)
                savedArray.push(aRide)
            }
            this.allMyRides = savedArray
        }
    }

    // FEATURE 8. Update/edit a part //Need to also add the rest of the attributes 
    public startEditing(ride: Ride): void {
        this.beforeEditFromCache = ride.startLocation
        this.beforeEditToCache = ride.finishLocation
    }

    //add dates validation
    // FEATURE 8. Update/edit a part
    public doneEditing(ride: Ride): void {
        // FEATURE 10. Validate inputs
        if (!ride) {
            return
        }
        if (!ride.startLocation || !ride.finishLocation ||
            !ride.distance || !ride.startTime || !ride.finishTime) {
            this.removeRide(ride)
        }
        ride.startLocation = ride.startLocation.trim()
        ride.finishLocation = ride.finishLocation.trim()
        ride.title = ride.getTitle()
        ride.speed = ride.calcSpeed()
        ride.duration = ride.calcDuration(ride.startTime, ride.finishTime)
    }

    // FEATURE 9. Discard /revert edits to a part
    cancelEditing(ride: Ride): void {
        ride.finishLocation = this.beforeEditToCache
        ride.startLocation = this.beforeEditFromCache
        ride.title = ride.getTitle()
        ride.speed = ride.calcSpeed()
    }

    // FEATURE 5.	Delete a selected part --i just put this feature coz I need it in the filter feature, feel free to update with ur code
    public removeRide(targetRideId: number | Ride): void {
        const index: number = this.allMyRides.findIndex(ride => ride.id === targetRideId)
        this.allMyRides.splice(index, 1)
        for (let aRide of this.allMyRides) {
            if (aRide.id > targetRideId) {
                aRide.id--
            }
        }
    }
    // FEATURE 12.	A calculation across many parts
    public getTotalRidesCount(ridesArray: Array < any > ): number {
        let activityCount: number = ridesArray.length
        return activityCount
    }

    public getTotalDuration(ridesArray: Array < any > ): number {
        let result: number = 0
        for (let activity of ridesArray) {
            let duration: number = activity.duration
            result += duration
        }
        return result
    }

    public getTotalDistance(ridesArray: Array < any > ): number {
        let result: number = 0
        for (let aRide of ridesArray) {
            let distance: number = aRide.distance
            result += distance
        }
        return result
    }


    // FEATURE 3.	Sort parts 

    public sortByStartTime(sortBy: string) {
        switch (sortBy) {
            case "asc": {
                return this.allMyRides.sort((a, b) => a.startTime - b.startTime)
            }
            case "desc": {
                return this.allMyRides.sort((a, b) => b.startTime - a.startTime)
            }
        }
    }
    public sortByFinishTime(sortBy: string) {
        switch (sortBy) {
            case "asc": {
                return this.allMyRides.sort((a, b) => a.FinishTime - b.FinishTime)
            }
            case "desc": {
                return this.allMyRides.sort((a, b) => b.FinishTime - a.FinishTime)
            }
        }
    }
    public sortByDuration(sortBy: string) {
        switch (sortBy) {
            case "asc": {
                return this.allMyRides.sort((a, b) => a.duration - b.duration)
            }
            case "desc": {
                return this.allMyRides.sort((a, b) => b.duration - a.duration)
            }
        }
    }
    public sortByTitle(sortBy: string) {
        switch (sortBy) {
            case "asc": {
                return this.allMyRides.sort((a, b) => a.title.toUpperCase() - b.title.toUpperCase())
            }
            case "desc": {
                return this.allMyRides.sort((a, b) => b.title.toUpperCase() - a.title.toUpperCase())
            }

        }
    }
    public sortBySpeed(sortBy: string) {
        switch (sortBy) {
            case "asc": {
                return this.allMyRides.sort((a, b) => a.speed - b.speed)
            }
            case "desc": {
                return this.allMyRides.sort((a, b) => b.speed - a.speed)
            }
        }
    }

    public sortByDistance(sortBy: string) {
        switch (sortBy) {
            case "asc": {
                return this.allMyRides.sort((a, b) => a.distance - b.distance)
            }
            case "desc": {
                return this.allMyRides.sort((a, b) => b.distance - a.distance)
            }
        }
    }
    // FEATURE 14. Find a part given a search criteria
    public findRideByTitle(aLocation: string) {
        return this.allMyRides.filter(ride => ride.title.includes(aLocation))
    }


    // FEATURE 14. Find a part given a search criteria
    public findRideByDate(aDate: string) {
        return this.allMyRides.filter(ride => ride.getLocaleDate(ride.startTime) === aDate)
    }
    // FEATURE 14.	Find a part given a search criterion
    public findRideById(targetID: number) {
        return this.allMyRides.filter((ride: Ride) => ride.id === targetID)
    }
}


export default RideHistory;