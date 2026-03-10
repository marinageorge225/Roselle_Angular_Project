import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  isAdmin = false;
  isLoading = false;
  errorMessage = '';
  private returnUrl = '/Master';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {


    // Pick up ?returnUrl=/checkout so we can redirect after login
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/Master';
  }

  toggleRole(): void {
    this.isAdmin = !this.isAdmin;
    this.errorMessage = '';
  }

  onSubmit(): void {
  if (!this.email || !this.password) {
    this.errorMessage = 'Please fill in all fields.';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.auth.login(this.email, this.password).subscribe({
    next: (res: any) => {
      this.auth.setCurrentUser(res.user);
      this.isLoading = false;
      if (res.status=='success') {
        this.router.navigateByUrl('/');
      } else {
        this.errorMessage = res.message || 'Login failed';
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.message || 'Login failed';
    }
  });
}
  
  
}
