import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, filter, mergeMap } from 'rxjs/operators';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-dso-navigation-toolbar',
  templateUrl: './dso-navigation-toolbar.component.html',
  styleUrls: ['./dso-navigation-toolbar.component.scss']
})
export class DsoNavigationToolbarComponent implements OnInit {
  menuItems = [
    {
      label: 'Home',
      link: 'home',
      icon: 'fa-home'
    },
    {
      label: 'Dashboard',
      link: 'dashboard',
      icon: 'fa-chart-pie'
    },
    {
      label: 'Item Conversion',
      link: 'itemConv',
      icon: 'fa-list-ol'
    },
    {
      label: 'UDA Conversion',
      link: 'udaSetup',
      icon: 'fa-map'
    },
    {
      label: 'Item Class Conversion',
      link: 'itemClassConv',
      icon: 'fa-sitemap'
    },
    {
      label: 'Setup',
      link: 'setup',
      icon: 'fa-layer-group'
    }
];
  title: string;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public router: Router, public route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) route = route.firstChild
        return route
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => this.title = data['title']
    );

  }
}
