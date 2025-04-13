// Define the User interface
interface User {
  email: string;
  password: string;
}

// Mock users database
const mockUsers: User[] = [
  { email: "test@example.com", password: "password123" },
  { email: "admin@example.com", password: "adminpass" },
  { email: "user1@example.com", password: "user1pass" },
];

// Function to authenticate a user
export function authenticate(email: string, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        resolve(true); // Authentication successful
      } else {
        reject(new Error("Credenciales incorrectas")); // Authentication failed
      }
    }, 1000); // Simulate network request delay
  });
}