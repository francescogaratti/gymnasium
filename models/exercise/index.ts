export interface Exercise{
    id:string;
    name:string;
    sets:number;
    reps:number;
    rest: {
        minutes:number;
        seconds:number;
    }
    notes:string;
}

export class Exercise implements Exercise{
    constructor(){
        this.id = null;
        this.name= null;
        this.sets = null;
        this.reps = null;
        this.rest = {
            minutes:null,
            seconds:null
        };
    }
}