import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Todo } from './todo/todo';
import { Weather } from './weather/weather';
import { MapRouting } from './map-routing/map-routing';
 
const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'todo', pathMatch: 'full' },
      { path: 'todo', component: Todo },
      { path: 'weather', component: Weather },
      { path: 'map-routing', component: MapRouting }
    ]
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeTestsRoutingModule {}
