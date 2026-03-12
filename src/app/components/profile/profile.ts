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
  errorMsg = '';
  isLoading = false;
  showDeleteConfirm = false;

  // Personal
  name = '';
  phone = '';

  // Address
  address = '';

  // Payment
  cardHolder = '';
  cardNumber = '';
  expiry = '';

  orderCount = 0;
  wishlistCount = 0;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUser();
    this.loadCounts();
  }

  loadUser(): void {
    this.user = this.auth.currentUser();
    if (!this.user) return;
    this.name = this.user.name;
    this.phone = this.user.phone ?? '';
    this.address = this.user.Address ?? '';
    this.cardHolder = this.user.paymentDetails?.cardHolder ?? '';
    this.cardNumber = this.user.paymentDetails?.cardNumber ?? '';
    this.expiry = this.user.paymentDetails?.expiry ?? '';
  }

  loadCounts(): void {
  this.auth.orders().subscribe({
    next: (orders: any[]) => (this.orderCount = orders?.length ?? 0),
    error: () => (this.orderCount = 0),
  });

  this.wishlistCount = this.auth.wishlist.length;
}

  savePersonal(): void {
    this.isLoading = true;
    this.auth.updateProfile({ name: this.name, phone: this.phone }).subscribe({
      next: () => {
        this.loadUser();
        this.showSuccess('Personal info saved!');
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to save. Please try again.';
        this.isLoading = false;
        setTimeout(() => (this.errorMsg = ''), 3000);
      },
    });
  }

saveAddress(): void {
  this.isLoading = true;
  this.auth.updateProfile({ Address: this.address }).subscribe({  
    next: (res) => {
      this.loadUser();
      this.showSuccess('Address saved!');
      this.isLoading = false;
    },
    error: () => {
      this.errorMsg = 'Failed to save. Please try again.';
      this.isLoading = false;
      setTimeout(() => (this.errorMsg = ''), 3000);
    },
  });
}

  savePayment(): void {
    this.isLoading = true;
    this.auth.updateProfile({
      paymentDetails: {
        cardHolder: this.cardHolder,
        cardNumber: this.cardNumber,
        expiry: this.expiry,
      },
    }).subscribe({
      next: () => {
        this.showSuccess('Payment details saved!');
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to save. Please try again.';
        this.isLoading = false;
        setTimeout(() => (this.errorMsg = ''), 3000);
      },
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteAccount(): void {
    this.auth.delete().subscribe({
      next: () => {
        this.auth.logout(); // make sure you have a logout method that clears the user
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMsg = 'Failed to delete account. Please try again.';
        this.showDeleteConfirm = false;
        setTimeout(() => (this.errorMsg = ''), 3000);
      },
    });
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => (this.successMsg = ''), 3000);
  }

  get maskedCard(): string {
    const n = this.cardNumber.replace(/\s/g, '');
    if (n.length < 4) return this.cardNumber;
    return '**** **** **** ' + n.slice(-4);
  }
}