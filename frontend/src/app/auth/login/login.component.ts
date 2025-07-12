import { NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = "";
  private http = inject(HttpClient);
  private cartService = inject(CartService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.http
      .post("http://localhost:3000/customers/login", {
        email: this.f["email"].value,
        password: this.f["password"].value,
      })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem("userEmail", response.email);
          this.router.navigate(["/dashboard"]);
          this.cartService.clearCart();
        },
        error: (err) => {
          this.errorMessage = err.error.message || "Błąd logowania.";
        },
      });
  }
}
