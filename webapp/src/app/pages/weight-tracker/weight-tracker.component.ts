import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { UtilsService } from '@services/utils.service';
//import { WeigthRecord } from '@models/exercise';

class WeigthRecord {
	date: string;
	weigth: number;
  constructor(date, weigth) {
     this.date = date;
     this.weigth = weigth
   }
  } 

@Component({
  selector: 'app-weight-tracker',
  templateUrl: './weight-tracker.component.html',
  styleUrls: ['./weight-tracker.component.sass']
})


export class WeightTrackerComponent implements OnInit {
  user: User = null;
  dateFormControl: FormControl = new FormControl('', [Validators.required]);
  weigthFormControl: FormControl = new FormControl('', [Validators.required]);
  

  formsControl: FormControl[] = [ 
    this.dateFormControl,
    this.weigthFormControl
  ]

  constructor(private auth: AuthService, private utils: UtilsService) {}

  ngOnInit(): void {}
    reset() {
		this.formsControl.forEach((f: FormControl) => f.setValue(null));
	}

  addRecord() {
    let date = this.dateFormControl.value;
    let weigth = this.weigthFormControl.value;

    let newWeigthRecord = new WeigthRecord(date, weigth);
    console.log(newWeigthRecord);

  }
  
  
  
}
