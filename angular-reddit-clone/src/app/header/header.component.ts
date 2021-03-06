import { Component, OnInit, Input } from '@angular/core';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from '../auth/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faUser = faUser;
  isLoggedIn: boolean;
  username: string;


  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    this.authService.loggedIn.subscribe((data: boolean) => this.isLoggedIn = data);
    this.authService.username.subscribe((data: string) => this.username = data);
    if(this.checkLoggedIn()) { 
      this.isLoggedIn = true;
      this.username = this.authService.getUsername();
    }
  }

  checkLoggedIn() {
    return this.authService.isLoggedIn();
  }
  
  goToUserProfile() {
    this.router.navigateByUrl('/user-profile/'+this.username);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('');
  }
}
