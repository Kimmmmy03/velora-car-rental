// Reference only — these accounts must exist in Supabase Auth and public.users.
export const mockUsers = [
  {
    userId: 1,
    fullName: 'System Administrator',
    email: 'admin@velora.com',
    password: 'admin123',
    role: 'ADMIN',
    phoneNumber: '+60123456789',
    driverLicenseNumber: 'A12345678',
  },
  {
    userId: 2,
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    phoneNumber: '+60187654321',
    driverLicenseNumber: 'D98765432',
  },
  {
    userId: 3,
    fullName: 'Sarah Ahmad',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    phoneNumber: '+60191234567',
    driverLicenseNumber: 'D11223344',
  },
]
