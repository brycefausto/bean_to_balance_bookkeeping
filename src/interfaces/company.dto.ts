export interface CreateCompanyDto {
  name: string;
  email: string;
  image?: string;
  phone: string;
  address: string;
  userId: string;
}

export interface UpdateCompanyDto {
  name: string;
  email: string;
  image?: string;
  phone: string;
  address: string;
}