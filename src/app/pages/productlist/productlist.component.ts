import { Component, inject } from '@angular/core';
import { APIResponseModel, IProduct } from '../../core/model/model';
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

  ngOnInit(): void {
    this.getAllProduct();
    this.categoryList$ = this.productService.getAllcategory();
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
