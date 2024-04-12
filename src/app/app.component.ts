import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from './core/services/product.service';
declare var $: any;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angularecommerce';
  userRegister: any = {
    CustId: 0,
    Name: '',
    MobileNo: '',
    Password: '',
  };
  loginObj: any = {
    UserName: '',
    UserPassword: '',
  };
  loggedUSerData: any;
  cartData: any[] = [];
  subtotal: number = 0;
  constructor(private productSr: ProductService) {
    const localData = localStorage.getItem('ecomUser');
    if (localData != null) {
      this.loggedUSerData = JSON.parse(localData);
    }
    this.productSr.onCartUpdated$?.subscribe((res) => {
      this.getCart();
    });
  }
  ngOnInit() {
    this.getCart();
  }
  getCart() {
    this.productSr
      .getCartDataByCustId(this.loggedUSerData.custId)
      .subscribe((res: any) => {
        if (res.result) {
          this.cartData = res.data;
          this.subtotal = this.cartData.reduce((acc, currentobj) => {
            return acc.productPrice + currentobj.productPrice;
          });
        } else {
          alert(res.message);
        }
      });
  }
  removeCartProduct(cartId: number) {
    this.productSr.removeProduct(cartId).subscribe((res: any) => {
      if (res.result) {
        this.getCart();
      } else {
        alert(res.message);
      }
    });
  }
  onRegister() {
    this.productSr.onRegister(this.userRegister).subscribe((res: any) => {
      if (res.result) {
        alert('Signup Success');
        $('#myModal').modal('toggle');
      } else {
        alert(res.message);
      }
    });
  }
  onLogin() {
    this.productSr.onLogin(this.loginObj).subscribe((res: any) => {
      if (res.result) {
        alert('Login Success');
        $('#loginModel').modal('toggle');
        this.loggedUSerData = res.data;
        localStorage.setItem('ecomUser', JSON.stringify(res.data));
      } else {
        alert(res.message);
      }
    });
  }
  logOff() {
    localStorage.removeItem('ecomUser');
    this.loggedUSerData = undefined;
  }
}
