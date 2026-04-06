import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './home/home';
import { About } from './about/about';
import { Feedback } from './feedback/feedback';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'feedback', component: Feedback },
  { path: '**', redirectTo: 'dashboard' }
];