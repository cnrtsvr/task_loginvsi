import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private store: Store) {}

  handleSetTestData = () => {
    this.store.dispatch(actions.setTestData())
  }

  handleClearTestData = () => {
    this.store.dispatch(actions.clearTestData())
  }
}
