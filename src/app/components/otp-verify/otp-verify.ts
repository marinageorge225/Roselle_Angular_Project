import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.css',
})
export class OtpVerify implements OnInit, OnDestroy {
  digits = ['', '', '', '', '', ''];
  isLoading = false;
  errorMessage = '';
  resendCountdown = 30;
  canResend = false;
  private timer: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  get email(): string { return this.auth.pendingEmail(); }

  startTimer(): void {
    this.resendCountdown = 30;
    this.canResend = false;
    this.timer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.timer);
        this.canResend = true;
      }
    }, 1000);
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    this.digits[index] = val;
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      (prev as HTMLInputElement)?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    const nums = text.replace(/\D/g, '').slice(0, 6);
    nums.split('').forEach((c, i) => { if (i < 6) this.digits[i] = c; });
  }

  get otpValue(): string { return this.digits.join(''); }

  verify(): void {
  if (this.otpValue.length < 6) {
    this.errorMessage = 'Please enter all 6 digits.';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.auth.verifyOtp(this.otpValue).subscribe({
    next: (res: any) => {
      this.isLoading = false;

      if (res.status === 'success') {
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = res.message || 'Invalid code. Please try again.';
        this.digits = ['', '', '', '', '', ''];
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.message || 'Something went wrong';
      this.digits = ['', '', '', '', '', ''];
    }
  });
}

 resend(): void {
  if (!this.canResend) return;


  this.isLoading = true;
  this.errorMessage = '';
  this.auth.resendotp().subscribe({
    next: (res: any) => {
      this.isLoading = false;
      if (res.status === 'success') {
        console.log('OTP resent successfully', res);
        this.startTimer();
      } else {
        this.errorMessage = res.message || 'Something went wrong';
        this.digits = ['', '', '', '', '', ''];
      }
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.message || 'Something went wrong';
    }
  });
}
}
