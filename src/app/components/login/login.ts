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

    setTimeout(() => {
      const result = this.auth.login(this.email, this.password, this.isAdmin);
      this.isLoading = false;
      if (result === 'success') {
        // Admin always goes to dashboard; users go to returnUrl (e.g. /checkout)
        this.router.navigateByUrl(this.isAdmin ? '/admin' : this.returnUrl);
      } else if (result === 'not_found') {
        this.errorMessage = 'No account found with this email.';
      } else if (result === 'wrong_pass') {
        this.errorMessage = this.isAdmin ? 'Invalid credentials or insufficient permissions.' : 'Incorrect password.';
      } else if (result === 'need_verify') {
        this.errorMessage = 'Please verify your email first.';
      } else if (result === 'restricted') {
        this.errorMessage = 'Your account has been restricted. Please contact support.';
      }
    }, 800);
  }
}
