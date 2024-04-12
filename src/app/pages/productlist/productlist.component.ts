import { Component, inject } from '@angular/core';
import { APIResponseModel, CartClass, IProduct } from '../../core/model/model';
import { ProductService } from '../../core/services/product.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LazyImageDirective } from '../../shared.directive/lazy-image.directive';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [CommonModule, LazyImageDirective, AsyncPipe],
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css',
})
export class ProductlistComponent {
  productList: IProduct[] = [];
  categoryList$: Observable<APIResponseModel> | undefined;
  productService = inject(ProductService);
  cartObj: CartClass = new CartClass();
  loggedUserId: number = 0;
  ngOnInit(): void {
    this.getAllProduct();

    const loggedUser = localStorage.getItem('ecomUser');
    if (loggedUser) {
      const { custId } = JSON.parse(loggedUser);
      this.loggedUserId = custId;
    }
    this.categoryList$ = this.productService.getAllcategory();
  }

  addToCart(productId: number) {
    this.cartObj.ProductId = productId;
    this.cartObj.CustId = this.loggedUserId;
    this.cartObj.Quantity = 1;
    this.productService.onAddToCart(this.cartObj).subscribe(
      (res: APIResponseModel) => {
        if (res.result) {
          alert('Product Added to Cart');
          this.productService.onCartUpdated$?.next(true);
        }
      },
      (error) => {
        alert('Error From API');
      }
    );
  }
  getAllProduct() {
    this.productService.getAllProduct().subscribe(
      (res: APIResponseModel) => {
        this.productList = res.data;
      },
      (error) => {
        alert('Error From API');
      }
    );
  }
  getProductByCategory(cateId: number) {
    this.productService.getAllProductsByCategoryId(cateId).subscribe(
      (res: APIResponseModel) => {
        this.productList = res.data;
      },
      (error) => {
        alert('Error From API');
      }
    );
  }
}
