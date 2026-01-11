import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'item', loadChildren: () => import('./features/item/item.routes') }
];
