export interface Product {
  id: number;
  name: string;
  description: string;
  imageName: string;
  productCategoryId: number;
  purchasePrice: number;
  salesPrice: number;
  qtyInStock: number;
  valueOnHand: number;
  imageFile?: File;
}
