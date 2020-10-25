import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  template: '<p>Callback works</p>',
//  styleUrls: ['./header.component.css']
})
export class CallbackComponent implements OnInit {
    public name: number;

    constructor(
        private route: ActivatedRoute,
      ) { }
    
      ngOnInit() {
        this.route.queryParams.subscribe(params => {
          this.name = params['name'];
        });
      }
}
