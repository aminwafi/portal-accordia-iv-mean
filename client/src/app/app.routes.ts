import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { authGuard } from './core/guards/auth-guard';
import { userGuard } from './core/guards/user-guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [userGuard] },
    { path: 'item', loadChildren: () => import('./features/item/item.routes'), canActivate: [authGuard]},
];
