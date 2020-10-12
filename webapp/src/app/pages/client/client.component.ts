import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.sass']
})
export class ClientComponent implements OnInit {
  id:string;
  constructor(private router:ActivatedRoute) {
    this.id = this.router.snapshot.queryParams['id'];
   }

  ngOnInit(): void {
  }

}
