export class CreateRestaurantDto {
  companyName: string;
  managerName: string;
  managerEmail: string;
  companyPhone: string;
  isActive?: boolean;
  password: string;
}
