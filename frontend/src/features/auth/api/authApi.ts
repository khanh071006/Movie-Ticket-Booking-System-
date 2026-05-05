// src/features/auth/api/authApi.ts

export interface LoginResponse {
    user: string;
    token: string;
}

export const mockLogin = (email: string, pass: string): Promise<LoginResponse> => {
    // Thêm <LoginResponse> vào đây để TS chắc chắn về kiểu resolve
    return new Promise<LoginResponse>((resolve, reject) => {
        setTimeout(() => {
            if (email === "admin@hust.edu.vn" && pass === "123456") {
                resolve({ user: "Admin HEDSPI", token: "mock-jwt-token-2026" });
            } else {
                reject("Sai tài khoản hoặc mật khẩu! (Thử: admin@hust.edu.vn / 123456)");
            }
        }, 1000);
    });
};

export const mockSignup = (name: string, email: string, pass: string): Promise<LoginResponse> => {
    return new Promise<LoginResponse>((resolve, reject) => {
        setTimeout(() => {
            if (email.includes("@")) {
                resolve({ user: name, token: "mock-jwt-token-new-user" });
            } else {
                reject("Email không hợp lệ!");
            }
        }, 1000);
    });
};