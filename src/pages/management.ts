import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {TabListComponent} from '../components/tabListComponent';

import 'bootstrap/dist/css/bootstrap.min.css';

@NgModule({
  imports:      [ BrowserModule ],
  providers:    [  ],
  declarations: [TabListComponent],
  exports:      [  ],
  bootstrap:    [TabListComponent]
})
export class ManagementModule{

}