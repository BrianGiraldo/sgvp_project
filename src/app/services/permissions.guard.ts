import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private router: Router) {}

  userInfo;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
    const ups = this.userInfo.type;

    if (state.url === '/usuarios') {
      if (ups === 3) {
        return true;
      } else {
        this.router.navigate(['/inicio']);
        return false;
      }
    } else if (state.url === '/ofertas') {
      if (ups === 1 || ups === 3 || ups === 2) {
        return true;
      } else {
        this.router.navigate(['/inicio']);
        return false;
      }
    }
    return state.url === '/inicio';
  }
}
