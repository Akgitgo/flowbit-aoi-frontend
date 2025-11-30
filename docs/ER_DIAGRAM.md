# ER Diagram (Mermaid)

```mermaid
erDiagram
  USERS ||--o{ AOI : owns
  AOI {
    string id PK
    string name
    string owner_id FK
    object geometry
    datetime created_at
    datetime updated_at
  }
  USERS {
    string id PK
    string name
    string email
  }
```
