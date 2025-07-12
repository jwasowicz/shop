# System Zarządzania Zamówieniami

## 1. Faza projektowania

### A. Wymagania funkcjonalne

System umożliwia:

- Przechowywanie informacji o klientach: imię, nazwisko, e-mail
- Przechowywanie informacji o produktach: nazwa, cena, stan magazynowy
- Rejestrowanie zamówień: data, łączna wartość, lista produktów
- Powiązanie klienta z jego zamówieniami oraz powiązanie zamówień z produktami

### B. Wymagania niefunkcjonalne

- Spójność i poprawność danych (np. brak możliwości zamówienia produktu niedostępnego w magazynie)
- Obsługa wielu użytkowników i wielu zamówień jednocześnie

### C. Diagram ERD

<img width="703" height="520" alt="Untitled" src="https://github.com/user-attachments/assets/6453d99f-4fe1-4ddb-bd66-2719761ff481" />

### D. Encje i typy pól

**Tabela `customer`**

- `id`: serial, primary key
- `email`: varchar
- `password`: varchar

**Tabela `product`**

- `id`: serial, primary key
- `name`: varchar
- `price`: numeric
- `stock`: integer

**Tabela `order`**

- `id`: serial, primary key
- `date`: timestamp
- `customerId`: integer, foreign key → `customer(id)`
- `totalValue`: numeric
- `status`: varchar

### E. Związki między encjami

- Jeden klient może mieć wiele zamówień (1:N)
- Jedno zamówienie może zawierać wiele produktów (N:M, przez `order_items`)
- Jeden produkt może znajdować się w wielu zamówieniach (N:M)

### F. Normalizacja

- **1NF**: brak powtarzających się kolumn, wszystkie wartości są atomowe
- **2NF**: wszystkie atrybuty zależą od całego klucza głównego
- **3NF**: brak zależności przechodnich

---

## 2. Faza implementacji

### A. Tworzenie bazy danych

- Baza danych utworzona w PostgreSQL
- Typy danych zgodne z modelem logicznym
- Zdefiniowane klucze główne i obce
- Ograniczenia:
  - `NOT NULL`
  - `UNIQUE` (dla `email`)
  - `CHECK` (`price >= 0`, `stock >= 0`)

### B. Przykładowe dane

INSERT INTO product (name, price, stock) VALUES
('Waffle with Berries', 6.5, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Vanilla Bean Crème Brûlée', 7.0, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Macaron Mix of Five', 8.0, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Classic Tiramisu', 5.5, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Pistachio Baklava', 4.0, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Lemon Meringue Pie', 5.0, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Red Velvet Cake', 4.5, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Salted Caramel Brownie', 4.5, FLOOR(RANDOM() * (100 - 10 + 1) + 10)),
('Vanilla Panna Cotta', 6.5, FLOOR(RANDOM() * (100 - 10 + 1) + 10));

---


