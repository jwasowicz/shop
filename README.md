# System zarządzania zamówieniami

## 1. Faza projektowania

### A. Wymagania funkcjonalne

System umożliwia:
- Rejestrację klientów z unikalnym adresem e-mail i hasłem
- Przechowywanie danych o produktach: nazwa, cena, stan magazynowy
- Tworzenie zamówień powiązanych z klientem
- Dodawanie wielu produktów do jednego zamówienia (relacja N:M)
- Obliczanie wartości zamówienia i aktualizacja jego statusu (np. "open", "submitted")
- Automatyczne zmniejszanie stanów magazynowych po zatwierdzeniu zamówienia
- Możliwość ponownego składania zamówienia, jeśli ostatnie zostało zatwierdzone
- Możliwość edycji zamówienia przed jego zatwierdzeniem
- Wyszukiwanie produktów, które zostały zamówione przynajmniej raz
- Pobieranie liczby zamówień dla danego klienta
- Wysyłanie zamówienia z frontendu do backendu poprzez REST API

### B. Wymagania niefunkcjonalne

- System powinien obsługiwać wielu użytkowników jednocześnie
- Spójność danych musi być zachowana przy współdzieleniu zasobów (np. stock produktów)
- Dane muszą być odporne na błędy użytkownika (np. walidacja e-maila, unikalność, brak możliwości zamówienia pustego koszyka)
- Bezpieczeństwo — hasła muszą być hashowane
- System powinien być łatwo rozszerzalny (architektura modularna, np. NestJS + Angular)
- Całość uruchamialna lokalnie z Docker Compose
- Frontend powinien reagować na brak zalogowanego użytkownika (localStorage)
- System powinien synchronizować koszyk na bieżąco z backendem

### C. Diagram ERD

<img width="732" height="683" alt="bazaaa" src="https://github.com/user-attachments/assets/9c31d1af-2f89-49de-a11f-dc1bd123648a" />

### D. Encje i typy pól

#### Tabela `customer`
- `id`: serial, primary key
- `email`: varchar, unique
- `password`: varchar

#### Tabela `product`
- `id`: serial, primary key
- `name`: varchar
- `price`: numeric (CHECK: price >= 0)
- `stock`: integer (CHECK: stock >= 0)

#### Tabela `order`
- `id`: serial, primary key
- `date`: timestamp
- `customerId`: integer, foreign key → `customer(id)`
- `totalValue`: numeric
- `status`: varchar ("open", "submitted")

#### Tabela `order_products_product`
- `orderId`: integer, foreign key → `order(id)`
- `productId`: integer, foreign key → `product(id)`

### E. Związki między encjami

- Klient 1:N Zamówienia
- Zamówienie N:M Produkty (przez tabelę `order_products_product`)
- Produkt N:M Zamówienia

### F. Normalizacja

- 1NF — brak powtarzalnych grup, kolumny zawierają wartości atomowe
- 2NF — wszystkie kolumny zależne od całego klucza głównego
- 3NF — brak zależności przechodnich między atrybutami

---

## 2. Faza implementacji

### A. Baza danych

- PostgreSQL z TypeORM
- Klucze główne, obce, ograniczenia CHECK/NOT NULL/UNIQUE

### B. Przykładowe dane

```sql
INSERT INTO product (name, price, stock) VALUES
('Waffle with Berries', 6.5, 20),
('Vanilla Bean Crème Brûlée', 7.0, 15),
('Macaron Mix of Five', 8.0, 30),
('Classic Tiramisu', 5.5, 10),
('Pistachio Baklava', 4.0, 5);
```

---

## 3. Operacje i zapytania SQL

### 1. Lista klientów z liczbą zamówień
```sql
SELECT c.email, COUNT(o.id) AS order_count
FROM customer c
LEFT JOIN "order" o ON o."customerId" = c.id
GROUP BY c.id;
```

### 2. Produkty zamówione przynajmniej raz
```sql
SELECT DISTINCT p.* FROM product p
JOIN order_products_product opp ON opp."productId" = p.id;
```

### 3. Zamówienia > 200zł
```sql
SELECT * FROM "order" WHERE "totalValue" > 200;
```

### 4. Dodaj klienta
```sql
INSERT INTO customer (email, password)
VALUES ('example@example.com', 'hashedPassword');
```

### 5. Zmień e-mail
```sql
UPDATE customer SET email = 'new@example.com' WHERE id = 1;
```

### 6. Usuń zamówienie
```sql
DELETE FROM "order" WHERE id = 1;
```

---

## 4. Architektura projektu

```
shop/
├── backend/
│ ├── erd/
│ └── src/
│ ├── controllers/
│ ├── dto/
│ ├── entities/
│ └── services/
├── frontend/
│ └── src/
│ └── app/
│ ├── auth/
│ ├── cart/
│ ├── dashboard/
│ ├── header/
│ ├── models/
│ ├── order/
│ ├── product-list/
│ └── services/
├── docker-compose.yml
└── README.md
```

---

## 5. Uruchomienie projektu

```bash
docker-compose up --build
```

- Backend: http://localhost:3000  
- Frontend: http://localhost:4200
