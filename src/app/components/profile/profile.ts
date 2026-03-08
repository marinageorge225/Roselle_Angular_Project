import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService, IUser } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  activeTab: 'personal' | 'address' | 'payment' = 'personal';
  user: IUser | null = null;
  successMsg = '';

  // Personal
  name = '';
  phone = '';

  // Address
  address = '';

  // Payment
  cardHolder = '';
  cardNumber = '';
  expiry = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/login']); return; }
    this.loadUser();
  }

  loadUser(): void {
    this.user = this.auth.currentUser();
    if (!this.user) return;
    this.name = this.user.name;
    this.phone = this.user.phone ?? '';
    this.address = this.user.address ?? '';
    this.cardHolder = this.user.paymentDetails?.cardHolder ?? '';
    this.cardNumber = this.user.paymentDetails?.cardNumber ?? '';
    this.expiry = this.user.paymentDetails?.expiry ?? '';
  }

  savePersonal(): void {
    this.auth.updateProfile({ name: this.name, phone: this.phone });
    this.loadUser();
    this.showSuccess('Personal info saved!');
  }

  saveAddress(): void {
    this.auth.updateProfile({ address: this.address });
    this.showSuccess('Address saved!');
  }

  savePayment(): void {
    this.auth.updateProfile({ paymentDetails: { cardHolder: this.cardHolder, cardNumber: this.cardNumber, expiry: this.expiry } });
    this.showSuccess('Payment details saved!');
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }

  get maskedCard(): string {
    const n = this.cardNumber.replace(/\s/g, '');
    if (n.length < 4) return this.cardNumber;
    return '**** **** **** ' + n.slice(-4);
  }

  get orderCount(): number { return this.auth.orders.length; }
  get wishlistCount(): number { return this.auth.wishlistCount; }
}
