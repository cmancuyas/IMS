export interface SalesOrder {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    description: string;
    imageName: string;
    productCategoryId: number;
    productCategory: any;
    purchasePrice: number;
    salesPrice: number;
    qtyInStock: number;
    valueOnHand: number;
    imageFile: any;
  };
  quantity: number;
  orderDate: Date;
  customerId: number;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    houseNumber: string;
    street: string;
    brgy: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  salesOrderStatusId: number;
  salesOrderStatus: {
    id: number;
    name: string;
  };
}
